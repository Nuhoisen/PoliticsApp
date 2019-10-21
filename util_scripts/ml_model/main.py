import numpy
import pickle
from keras.datasets import imdb
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers.embeddings import Embedding
from keras.preprocessing import sequence

# Hashes
import hashlib

# Math
from math import floor
from math import ceil

# Tensor flow hub
import tensorflow as tf
import tensorflow_hub as hub

import tensorflow_datasets as tfds

# Os for pwd
import os

# sys is for command line arguments
import sys


# Model for reference
model = None


# CHECKPOINT PATH
checkpoint_path = os.getcwd() + "\checkpoint.ckpt"

# <<<<<<< HEAD

# Tensorflow examples
dataset, info = tfds.load('imdb_reviews/subwords8k', with_info=True,
                          as_supervised=True)
train_dataset, test_dataset = dataset['train'], dataset['test']

encoder = info.features['text'].encoder



# load the dataset but only keep the top n words, zero the rest
top_words = 5000


entry_list = []
label_list = []

encoded_entry_list = []

hash_set = set()

with open("abortion_data_and_labels.pkl", 'rb') as pkl_fp:
    content_list = pickle.load(pkl_fp)
    for entry in content_list:
        try:
            if(entry["content"]):   # Only add entry if it is string
                content = entry["content"].encode('utf-8')
                # Take a hash of the content to check that if there 
                # are duplicates
                hash_object = hashlib.md5(content)
                hash_digest  = hash_object.hexdigest()
                if hash_digest not in hash_set:
                    hash_set.add(hash_digest)
                    # If the content is new (no collision)
                    # add it to the list
                    entry_list.append(entry["content"])  
                    encoded_entry_list.append( encoder.encode( entry["content"] ) )
                    # tf.Tensor(entry["content"], shape =(len(entry["content"]), ) )

                    label_list.append(entry["label"])

        except KeyError:
                continue
                                    
# embedding = "https://tfhub.dev/google/tf2-preview/gnews-swivel-20dim/1"
# hub_layer = hub.KerasLayer(embedding, input_shape=[], dtype=tf.string, trainable=True)

        #######################
        #######################
        ### PREPROCESS DATA ###
        #######################
        #######################
            
            
            
        ###########################
        ###########################
        ####### TRAIN DATA ########
        ###########################
        ###########################
train_data = encoded_entry_list[:floor(len(encoded_entry_list)/2)]
train_labels = label_list[:floor(len(label_list)/2)]
# NUMPY TYPE
tf_train_data = tf.keras.preprocessing.sequence.pad_sequences(  train_data,
                                                                padding='post')

#tf_train_labels = tf.keras.utils.to_categorical(train_labels, num_classes=1) 
tf_train_labels = numpy.array(train_labels)#tf.keras.utils.to_categorical(train_labels, num_classes=1) 



        ###########################
        ###########################
        ######## TEST DATA ########
        ###########################
        ###########################
test_data = encoded_entry_list[ceil(len(encoded_entry_list)/2):]
test_labels = label_list[ceil(len(label_list)/2):]
# NUMPY TYPE
tf_test_data = tf.keras.preprocessing.sequence.pad_sequences(  test_data,
                                                                padding='post')

# tf_test_labels  = tf.keras.utils.to_categorical(test_labels, num_classes=1)                                
tf_test_labels  = numpy.array(test_labels)#tf.keras.utils.to_categorical(test_labels, num_classes=1)                                


# print(tf_train_data.shape)
# print(tf_train_labels.shape)

# print(encoder.vocab_size)
BUFFER_SIZE = 10000
BATCH_SIZE = 64



    #######################
    #######################
    ### Build the model ###
    #######################
    #######################
            
def create_model(train_x_set, train_y_set):
    global model
    model = tf.keras.Sequential()
    model.add(tf.keras.layers.Embedding(input_dim=encoder.vocab_size, output_dim=32, input_length=train_x_set.shape[1], mask_zero=True)) # Embedding layer
    model.add(tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)))
    model.add(tf.keras.layers.Dense(32, activation='relu'   ))
    model.add(tf.keras.layers.Dense(1,  activation='sigmoid'))



    model.compile(  optimizer='adam',
                    loss='binary_crossentropy',
                    metrics=['accuracy'])

    print(model.summary())
    
    



def fit_new_model(train_x_set, train_y_set):
    global model
    print(checkpoint_path)
    
    
    #######################
    #######################
    ##Create a CHECKPOINT##
    #######################
    #######################
    cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=checkpoint_path,
                                                     save_weights_only=True,
                                                     verbose=1)

    model.fit(      x = train_x_set,
                    y = train_y_set,
                    epochs = 10,
                    verbose = 1,
                    callbacks=[cp_callback])



def run_saved_model_no_weights(train_x_set, train_y_set):
    global model
    #   Evaluate the model
    results = model.evaluate( x = train_x_set, y = train_y_set, verbose=2)



def run_saved_model(train_x_set, train_y_set):
    global model
    #   Evaluate the model
    model.load_weights(checkpoint_path)
    results = model.evaluate( x = train_x_set, y = train_y_set, verbose=2)


for arg in sys.argv:
    if arg == "1":
        create_model(train_x_set=tf_train_data, train_y_set=tf_train_labels)
        fit_new_model(train_x_set=tf_train_data, train_y_set=tf_train_labels)
    elif arg == "2":
        create_model(train_x_set=tf_train_data, train_y_set=tf_train_labels)
        run_saved_model(train_x_set=tf_train_data, train_y_set=tf_train_labels)
        
    elif arg == "3":
        create_model(train_x_set=tf_train_data, train_y_set=tf_train_labels)
        run_saved_model_no_weights(train_x_set=tf_train_data, train_y_set=tf_train_labels)
        
        
    elif arg == "-h":
        print("Tensor Flow: main.py")
        print("\tmain.py")
        print("\tArguments:")
        print("\t\t 1 : create_model")
        print("\t\t 2 : load_saved_model")
        print("\t\t 3 : load_saved_model_no_weights")

