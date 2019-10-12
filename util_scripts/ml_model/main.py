import numpy
import pickle
from keras.datasets import imdb
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers.embeddings import Embedding
from keras.preprocessing import sequence

# Math
from math import floor
from math import ceil

# Tensor flow hub
import tensorflow as tf
import tensorflow_hub as hub

import tensorflow_datasets as tfds

# fix random seed for reproducibility
numpy.random.seed(7)

train_validation_split = tfds.Split.TRAIN.subsplit([6, 4])

(train_data, validation_data), test_data = tfds.load(
    name="imdb_reviews", 
    split=(train_validation_split, tfds.Split.TEST),
    as_supervised=True)

print(train_data.batch(10))

# load the dataset but only keep the top n words, zero the rest
top_words = 5000


entry_list = []
label_list = []

with open("abortion_data_and_labels.pkl", 'rb') as pkl_fp:
    content_list = pickle.load(pkl_fp)
    for entry in content_list:
        try:
            if(entry["content"]):   # Only add entry if it is string
                # print(entry["content"])
                entry_list.append(entry["content"])
                
                # print(entry["label"])
                label_list.append(entry["label"])
                # print(entry["file_path"])
        except KeyError:
                continue



embedding = "https://tfhub.dev/google/tf2-preview/gnews-swivel-20dim/1"
hub_layer = hub.KerasLayer(embedding, input_shape=[], dtype=tf.string, trainable=True)

hub_layer(entry_list[:3])

# Build the model
model = tf.keras.Sequential()
model.add(hub_layer)
model.add(tf.keras.layers.Dense(16, activation='relu'))
model.add(tf.keras.layers.Dense(1, activation='sigmoid'))


print(model.summary())


# Extract a training set and a testing set
train_data = entry_list[:floor(len(entry_list)/2)]
train_labels = label_list[:floor(len(label_list)/2)]

test_data = entry_list[ceil(len(entry_list)/2):]
test_labels = label_list[ceil(len(label_list)/2):]



model.compile(optimizer='adam',
                loss='binary_crossentropy',
                metrics=['accuracy'])
                

model.fit(  train_data, 
            train_labels, 
            epochs=10, 
            batch_size=32,
            verbose=1)
            

# print(len(label_list))
# print(len(entry_list))
# (x_train, y_train), (X_test, y_test) = imdb.load_data(num_words=top_words)


# print(x_train[0])
# print(y_train[0])
	
# # truncate and pad input sequences
# max_review_length = 500
# x_train = sequence.pad_sequences(x_train, maxlen=max_review_length)
# X_test = sequence.pad_sequences(X_test, maxlen=max_review_length)

# embedding_vecor_length = 32
# model = Sequential()
# model.add(Embedding(top_words, embedding_vecor_length, input_length=max_review_length))
# model.add(LSTM(100))
# model.add(Dense(1, activation='sigmoid'))
# model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
# print(model.summary())
# model.fit(x_train, y_train, validation_data=(X_test, y_test), epochs=3, batch_size=64)

# # Final evaluation of the model
# scores = model.evaluate(X_test, y_test, verbose=0)
# print("Accuracy: %.2f%%" % (scores[1]*100))