import numpy
import pickle
from keras.datasets import imdb
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers.embeddings import Embedding
from keras.preprocessing import sequence
# fix random seed for reproducibility
numpy.random.seed(7)

3
	
# load the dataset but only keep the top n words, zero the rest
top_words = 5000


with open("abortion_data_and_labels.pkl", 'rb') as pkl_fp:
    content_list = pickle.load(pkl_fp)
    for entry in content_list:
        print(entry["content"])
        print(entry["label"])
        
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