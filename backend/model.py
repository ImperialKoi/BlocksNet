import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
import timm
import os, cv2
from PIL import Image

class ClassifierModel(nn.Module):
    def __init__(self, num_classes=2, dict = 
        {
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
    ):
        super().__init__()
        feature_layers = []
        fc_layers = []
        for layer_type, description in dict.items():
            if "conv" in layer_type:
                feature_layers.append(nn.Conv2d(in_channels=description["in_channels"],
                                        out_channels=description["out_channels"],
                                        kernel_size=description["kernel_size"],
                                        padding=description["padding"]))
                if str(description["act"]).lower() == "relu":
                    feature_layers.append(nn.ReLU())
                elif str(description["act"]).lower() == "sigmoid":
                    feature_layers.append(nn.Sigmoid())
                    
            elif "pool" in layer_type:
                feature_layers.append(nn.MaxPool2d(kernel_size=description["kernel_size"],
                                           stride=description["stride"]))
            elif "fcl" in layer_type:
                fc_layers.append(nn.Linear(in_features=description["in_features"],
                                        out_features=description["out_features"]))
                if str(description["act"]).lower() == "relu":
                    fc_layers.append(nn.ReLU())
                elif str(description["act"]).lower() == "sigmoid":
                    fc_layers.append(nn.Sigmoid())
            
        self.classifier = nn.Sequential(*list(fc_layers))
        self.features = nn.Sequential(*list(feature_layers))
    
    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        output = self.classifier(x)
        return output