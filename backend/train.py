import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
import timm
import os, cv2
from tqdm import tqdm
from PIL import Image

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

from model import ClassifierModel
from dataloader import CustomDataset

class Trainer:
    def __init__(self):
        self.architecture_dict = {
            "conv1": {"in_channels": 3, "out_channels": 16, "kernel_size": 3, "padding": 1, "act": "relu"},
            "pool1": {"kernel_size": 2, "stride": 2},
            "conv2": {"in_channels": 16, "out_channels": 32, "kernel_size": 3, "padding": 1, "act": "relu"},
            "pool2": {"kernel_size": 2, "stride": 2},
            "conv3": {"in_channels": 32, "out_channels": 64, "kernel_size": 3, "padding": 1, "act": "relu"},
            "pool3": {"kernel_size": 2, "stride": 2},
            "fcl_input1":  {"in_features": 64 * 16 * 16, "out_features": 256, "act": "relu"}, 
            "fcl_hidden1": {"in_features": 256, "out_features": 128, "act": "sigmoid"},
            "fcl_output1": {"in_features": 128, "out_features": 3, "act": "sigmoid"},
        }
        self.params = {
            "epochs": 10,
            "learning_rate": 0.001,
            "shuffle": True,
            "optimizer": "adam",
        }
    
    def train(self):
        """Dataloader"""
        transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
        ])

        train_folder = os.path.join(os.getcwd(), 'data', 'train')
        val_folder = os.path.join(os.getcwd(), 'data', 'valid')
        test_folder = os.path.join(os.getcwd(), 'data', 'test')

        train_dataset = CustomDataset(data_dir=train_folder, transform=transform)
        val_dataset = CustomDataset(data_dir=val_folder, transform=transform)
        test_dataset = CustomDataset(data_dir=test_folder, transform=transform)

        train_loader = DataLoader(train_dataset, batch_size=32, shuffle=self.params['shuffle'])
        val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
        test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

        target_to_class = {v: k for k, v in ImageFolder(train_folder).class_to_idx.items()}
        num_classes = len(target_to_class)

        """Train"""
        model = ClassifierModel(num_classes=num_classes, dict=self.architecture_dict)
        criterion = nn.CrossEntropyLoss() # Loss function
        optimizer = None
        if self.params['optimizer'] == 'adam':
            optimizer = optim.Adam(model.parameters(), lr=self.params['learning_rate'])
        if self.params['optimizer'] == 'sgd':
            optimizer = optim.sgd(model.parameters(), lr=self.params['learning_rate'])
        if self.params['optimizer'] == 'adagrad':
            optimizer = optim.adagrad(model.parameters(), lr=self.params['learning_rate'])
        if self.params['optimizer'] == 'rmsprop':
            optimizer = optim.rmsprop(model.parameters(), lr=self.params['learning_rate'])

        num_epochs = self.params['epochs']
        train_losses, val_losses = [], []
        device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

        for epoch in range(num_epochs):
            """Training phase"""
            model.train() # Set to training mode
            running_loss = 0.0 # Total loss for the epoch
            for images, labels in tqdm(train_loader, desc='Training loop'): # Loop over batches of training data
                images, labels = images.to(device), labels.to(device)
                optimizer.zero_grad() # Resets the gradients before backpropagation
                outputs = model(images) # Forward pass
                
                loss = criterion(outputs, labels) # Computes loss with cross entropy
                loss.backward() # Perform backpropagation, computes gradient of each weight, stores inside model params
                optimizer.step() # Update model weights using gradients computed by backward()
                running_loss += loss.item() * labels.size(0) # Batch loss * batck_size
                
            train_loss = running_loss / len(train_loader.dataset) # Average loss per sample
            train_losses.append(train_loss)
            
            """Validation phase"""
            model.eval()
            running_loss = 0.0
            with torch.no_grad():
                for images, labels in tqdm(val_loader, desc='Validation loop'):
                    images, labels = images.to(device), labels.to(device)
                    outputs = model(images)
                    
                    loss = criterion(outputs, labels)
                    running_loss += loss.item() * labels.size(0)
                
                val_loss = running_loss / len(val_loader.dataset)
                val_losses.append(val_loss)
                
                print(f'Epoch {epoch + 1}/{num_epochs} - Train loss: {train_loss} - Val loss: {val_loss}')
            
            torch.save(model.state_dict(), f"results\\ModelWeights{epoch + 1}.pth")
                
        """Save model and information"""
        torch.save(model.state_dict(), "results\\ModelWeights.pth")
        plt.plot(train_losses, label="Training loss")
        plt.plot(val_losses, label="Validation loss")
        plt.legend()
        plt.title("Loss over time")
        plt.savefig('results\\Loss_over_time.png')

if __name__ == "__main__":
    trainer = Trainer()
    trainer.train()
    
    




