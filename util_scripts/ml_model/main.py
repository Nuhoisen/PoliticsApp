# Tensor flow hub
import tensorflow as tf

# Os for pwd
import os

# sys is for command line arguments
import sys
import numpy as np

from util_scripts.ml_model.dataset_utils import (
    get_tf_datasets, create_raw_dataset
)

np.random.seed(123)  # Allows repeatable runs


def create_model(vocab_size, input_length):
    model = tf.keras.Sequential()
    model.add(tf.keras.layers.Embedding(input_dim=vocab_size,
                                        output_dim=32, input_length=input_length,
                                        mask_zero=True)
              ) # Embedding layer
    model.add(tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)))
    model.add(tf.keras.layers.Dense(32, activation='relu'))
    model.add(tf.keras.layers.Dense(1,  activation='sigmoid'))

    model.compile(  optimizer='adam',
                    loss='binary_crossentropy',
                    metrics=['accuracy'])

    print(model.summary())
    return model
    

def fit_new_model(model, train_x_set, train_y_set, train_kwargs=None):
    cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=CHECKPOINT_PATH,
                                                     save_weights_only=True,
                                                     verbose=1)
    train_kwargs["callbacks"] = [cp_callback]
    print("Train kwargs: {}".format(train_kwargs))
    return model.fit(x=train_x_set, y=train_y_set, **train_kwargs)


def run_saved_model(model, train_x_set, train_y_set, ckpt_path=None):
    if ckpt_path is not None:
        print("Loading weights from: {}".format(ckpt_path))
        model.load_weights(ckpt_path)
    else:
        print("Using default randomly initialized weights")
    results = model.evaluate(x=train_x_set, y=train_y_set, verbose=2)
    return results


if __name__ == '__main__':
    ########################################
    # User-defined stuff
    ########################################
    CHECKPOINT_PATH = os.getcwd() + "\checkpoint.ckpt"
    TRAIN_KWARGS = {
        "epochs": 10,
        "verbose": 1,
    }

    BUFFER_SIZE = 10000
    BATCH_SIZE = 64
    TEST_RATIO=0.5
    TRAIN_RATIO = 1 - TEST_RATIO
    ########################################
    # Using sys-args to determine what to do
    ########################################
    
    arg = sys.argv  # Make the assumption that it's just one arg

    if arg == "-h":
        print("Tensor Flow: main.py")
        print("\tmain.py")
        print("\tArguments:")
        print("\t\t 1 : create_model")
        print("\t\t 2 : load_saved_model")
        print("\t\t 3 : load_saved_model_no_weights")
        sys.exit(0)
    raw_train, raw_test, encoded_entry_list, label_list, encoder = create_raw_dataset()
    tf_train_data, tf_test_data = get_tf_datasets(
        encoded_entry_list,
        label_list,
        train_size=TRAIN_RATIO,
        test_size=TEST_RATIO
    )

    model=create_model(encoder.vocab_size, tf_train_data[0].shape[1])

    if arg == "1":
        model=fit_new_model(model,
                            train_x_set=tf_train_data[0],
                            train_y_set=tf_train_data[1],
                            train_kwargs=TRAIN_KWARGS
                            )

    elif arg == "2":
        run_saved_model(model,
                        train_x_set=tf_train_data[0],
                        train_y_set=tf_train_data[1]
                        )

    elif arg == "3":
        run_saved_model(model, train_x_set=tf_train_data,
                        train_y_set=tf_train_data[1], ckpt_path=CHECKPOINT_PATH
                        )

    else:
        print("Invalid argument provided: {}".format(arg))
        sys.exit(1)
