import base64
import os
import requests
from dotenv import load_dotenv
from PIL import Image
import io
load_dotenv()


engine_id = "stable-diffusion-512-v2-1"
api_host = os.getenv('API_HOST', 'https://api.stability.ai')
api_key = os.getenv("STABILITY_API_KEY")

A1111_URL = os.getenv("A1111_URL")


if api_key is None:
    raise Exception("Missing Stability API key.")


def create_image_dream_studio(width, height, prompt):
    response = requests.post(
        f"{api_host}/v1/generation/{engine_id}/text-to-image",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        json={
            "text_prompts": [
                {
                    "text": prompt
                }
            ],
            "cfg_scale": 7,
            "clip_guidance_preset": "FAST_BLUE",
            "height": int(height),
            "width": int(width),
            "samples": 1,
            "steps": 25,
        },
    )

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))


    data = response.json()
    folder_path = "./images/"
    existing_images = os.listdir(folder_path)
    image_count = len(existing_images)

    image_path = ""

    for i, image in enumerate(data["artifacts"]):
        image_number = i + image_count
        image_path = os.path.join(folder_path, f"{image_number+1}.png")
        with open(image_path, "wb") as f:
            print("saving image.")
            f.write(base64.b64decode(image["base64"]))
            return image_path

    return image_path


def generate_image_local(width, height, prompt):
    payload = {
        "prompt": prompt,
        "negative_prompt": "3d, disfigured, bad art, deformed, poorly drawn, strange colors, blurry, boring, lackluster, repetitive, cropped.",
        "batch_size": 1,
        "steps": 25,
        "height": height,
        "width": width,
        "cfg_scale": 7,
        "sampler_index": "Euler a",
    }


    # Trigger Generation
    response = requests.post(url=f'{A1111_URL}/sdapi/v1/txt2img', json=payload)
    print(response)
    # Read results
    r = response.json()
    result = r['images'][0]
    folder_path = "./images/"
    existing_images = os.listdir(folder_path)
    image_count = len(existing_images)
    image = Image.open(io.BytesIO(base64.b64decode(result.split(",", 1)[0])))
    image.save(folder_path+str(image_count+1)+".jpeg")

    return folder_path+str(image_count+1)+".jpeg"

# generate_image_local(512, 512)
# create_image_dream_studio("portrait, character, detailed.")