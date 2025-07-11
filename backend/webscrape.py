import os
import requests
import random
from dotenv import load_dotenv

class Scrape():
    def __init__(self):
        load_dotenv()
        self.UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

    def search_download(self, query, count=100):
        # Download images into memory first
        image_data_list = []
        for i in range(0, (count + 30 - 1) // 30):
            current_count = min(30, count - 30 * i)

            url = "https://api.unsplash.com/search/photos"
            params = {
                "query": query,
                "page": i + 1,
                "per_page": current_count,
                "client_id": self.UNSPLASH_ACCESS_KEY,
            }

            response = requests.get(url, params=params)
            data = response.json()

            for result in data.get("results", []):
                image_url = result["urls"]["regular"]
                try:
                    image_data = requests.get(image_url, timeout=10).content
                    image_data_list.append(image_data)
                except:
                    continue

        # Shuffle and split
        random.shuffle(image_data_list)
        total = len(image_data_list)
        train_split = int(0.7 * total)
        valid_split = int(0.2 * total)

        splits = {
            'train': image_data_list[:train_split],
            'valid': image_data_list[train_split:train_split + valid_split],
            'test': image_data_list[train_split + valid_split:]
        }

        # Save to correct folders
        base_dir = os.path.join(os.getcwd(), "data")
        for split, images in splits.items():
            split_class_dir = os.path.join(base_dir, split, query)
            os.makedirs(split_class_dir, exist_ok=True)

            for i, img in enumerate(images):
                filename = os.path.join(split_class_dir, f"{query}_{i+1}.jpg")
                with open(filename, "wb") as f:
                    f.write(img)
        print('Finished compiling dataset')
    
    def make_dataset(self, classes):
        for name in classes:
            self.search_download(name, 50)
        
if __name__ == '__main__':
    scrape = Scrape()
    scrape.make_dataset(["cat", "dog", "bird"])
