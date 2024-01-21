from torch import nn

# from style_transfer import gram_matrix
#
#
# class StyleLoss(nn.Module):
#
#     def __init__(self, target_feature):
#         super(StyleLoss, self).__init__()
#         self.target = gram_matrix(target_feature).detach()
#
#     def forward(self, input):
#         G = gram_matrix(input)
#         self.loss = F.mse_loss(G, self.target)
#         return input