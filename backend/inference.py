import torch
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import os

from model import ClassifierModel
from dataloader import CustomDataset
from torch.utils.data import DataLoader

class Inference:
    def __init__(self):
        pass
        
    # Load and preprocess the image
    def preprocess_image(self, image_path, transform):
        image = Image.open(image_path).convert("RGB")
        return image, transform(image).unsqueeze(0)

    # Predict using the model
    def predict(self, model, image_tensor, device):
        model.eval()
        with torch.no_grad():
            image_tensor = image_tensor.to(device)
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
        return probabilities.cpu().numpy().flatten()

    # Calculate accuracy
    def calculate_accuracy(self, model, dataloader, device):
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels in dataloader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                _, predicted = torch.max(outputs, 1)
                correct += (predicted == labels).sum().item()
                total += labels.size(0)
        return correct / total

    # Visualization
    def visualize_predictions(self, original_image, probabilities, class_names, accuracy):
        fig, axarr = plt.subplots(1, 2, figsize=(14, 7))

        # Display image
        axarr[0].imshow(original_image)
        axarr[0].axis("off")

        # Display predictions
        axarr[1].barh(class_names, probabilities)
        axarr[1].set_xlabel("Probability")
        axarr[1].set_title("Class Predictions")
        axarr[1].set_xlim(0, 1)

        # Add accuracy text
        acc_text = f"Test Accuracy: {accuracy * 100:.2f}%"
        axarr[1].text(
            1.0, -0.1, acc_text,
            ha="right", va="top", fontsize=12, transform=axarr[1].transAxes
        )

        plt.tight_layout()
        plt.savefig('results\\Inference_result.png')
        plt.show()
    
    def execute(self):
        # Main execution
        test_image = os.path.join(os.getcwd(), 'data', 'test', 'bird', 'bird_1.jpg')
        transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor()
        ])
        test_folder = os.path.join(os.getcwd(), 'data', 'test')
        test_dataset = CustomDataset(data_dir=test_folder, transform=transform)
        test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

        # Map class index to name
        target_to_class = {v: k for k, v in ImageFolder(test_folder).class_to_idx.items()}
        class_names = test_dataset.classes 
        num_classes = len(class_names)

        # Load model
        model = ClassifierModel(num_classes=num_classes)
        model.load_state_dict(torch.load(os.path.join('results', 'ModelWeights15.pth'), weights_only=True))
        device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        model.to(device)

        # Accuracy
        accuracy = self.calculate_accuracy(model, test_loader, device)

        # Inference on single image
        original_image, image_tensor = self.preprocess_image(test_image, transform)
        probabilities = self.predict(model, image_tensor, device)

        # Visualize
        self.visualize_predictions(original_image, probabilities, class_names, accuracy)

if __name__ == "__main__":
    infer = Inference()
    infer.execute()
