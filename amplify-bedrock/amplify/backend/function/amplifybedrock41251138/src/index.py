import base64
import boto3
import json
from random import randint

def handler(event, context):
    prompt = event.get('pathParameters', {}).get('imageURL')
    if not prompt:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'imageURL path parameter is required'})
        }
    bedrock_runtime = boto3.client("bedrock-runtime")
    
    s3 = boto3.client('s3')
    bucket_name = 'amplifybedrock-20240702114858-hostingbucket-dev'  # Replace with your S3 bucket name
    
    # Fetch the image from S3
    try:
        s3_response = s3.get_object(Bucket=bucket_name, Key="static-pipeline.jpeg")
        input_image_base64 = base64.b64encode(s3_response['Body'].read()).decode("utf-8")
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

    inference_params = {
        "taskType": "INPAINTING",
        "inPaintingParams": {
            "text": prompt,
            "negativeText": "bad quality, low res",
            "image": input_image_base64,
            "maskPrompt": "body of pipeline"
        },
        "imageGenerationConfig": {
            "numberOfImages": 3,
            "quality": "premium",
            "height": 1024,
            "width": 1024,
            "cfgScale": 8.0,
            "seed": randint(0, 100000),
        },
    }

    response = bedrock_runtime.invoke_model(
        modelId="amazon.titan-image-generator-v1", body=json.dumps(inference_params)
    )

    response_body = json.loads(response["body"].read())
    images = response_body["images"]
    output_urls = []
    for image_data in images:
        image_bytes = base64.b64decode(image_data)
        output_urls.append(base64.b64encode(image_bytes).decode("utf-8"))

    return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps({'urls': output_urls})
    }

