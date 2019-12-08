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

# fix random seed for reproducibility
numpy.random.seed(7)

train_validation_split = tfds.Split.TRAIN.subsplit([6, 4])


# Tensorflow examples
dataset, info = tfds.load('imdb_reviews/subwords8k', with_info=True,
                          as_supervised=True)
train_dataset, test_dataset = dataset['train'], dataset['test']

encoder = info.features['text'].encoder



print("Vocab size: {}".format(encoder.vocab_size))



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


print(tf_train_data.shape)
print(tf_train_labels.shape)

print(encoder.vocab_size)
BUFFER_SIZE = 10000
BATCH_SIZE = 64


            #######################
            #######################
            ### Build the model ###
            #######################
            #######################
model = tf.keras.Sequential()
model.add(tf.keras.layers.Embedding(input_dim=encoder.vocab_size, output_dim=32, input_length=tf_train_data.shape[1], mask_zero=True)) # Embedding layer
model.add(tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)))
model.add(tf.keras.layers.Dense(32, activation='relu'   ))
model.add(tf.keras.layers.Dense(1,  activation='sigmoid'))


print(model.summary())



model.compile(  optimizer='adam',
                loss='binary_crossentropy',
                metrics=['accuracy'])
                

model.fit(      x = tf_train_data,
                y = tf_train_labels,
                epochs = 10,
                verbose = 1 )


            
results = model.evaluate( x = test_data, y = test_labels, batch_size=32, verbose=2)
for name, value in zip(model.metrics_names, results):
    print("%s: %.3f" %(name, value))


# print(len(label_list))
# print(len(entry_list))
# (x_train, y_train), (X_test, y_test) = imdb.load_data(num_words=top_words)

