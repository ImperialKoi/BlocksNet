from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
from io import BytesIO
import cv2, base64, json, os
import uvicorn

from train import Trainer
from webscrape import Scrape
from inference import Inference

# CORS Configuration
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ListRequest(BaseModel):
    content: list
class ImageRequest(BaseModel):
    content: str
class DictRequest(BaseModel):
    content: dict
    
@app.post('/receive_architecture')
async def receive_architecture(req: ListRequest):
    # The req.content is a list of [architecture_dict, training params]
    architecture_dict = req.content[0]
    params = req.content[1]
    print(req.content)
    trainer = Trainer(architecture_dict, params)
    trainer.train()
    return {"status": "DONETRAINING"}

@app.post('/setup_dataset')
async def setup_dataset(req: ListRequest):
    # The re.content is a list of the classes the user wants to classify
    dataset = list(req.content)
    scrape = Scrape()
    scrape.make_dataset(dataset)
    return {"status": "DONEDOWNLOADING"}

@app.post('/inference')
async def inference(req: ImageRequest):
    image_data = base64.b64decode(req.content)
    image = Image.open(BytesIO(image_data))
    img_array = np.array(image)
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    cv2.imwrite(os.path.join(os.getcwd(), 'InferenceImg.png'), img_bgr)
    
    inference = Inference()
    inference.execute()
    
    output = cv2.imread(os.path.join(os.getcwd(), 'results', 'Inference_result.png'))
    output_array = np.array(output)
    _, output_encoded = cv2.imencode('.jpg', cv2.cvtColor(output_array, cv2.COLOR_RGB2BGR))
    output_base64 = base64.b64encode(output_encoded.tobytes()).decode('utf-8')
    return output_base64
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3500)

    
    
    



