import numpy as np
import pickle
import hashlib

from math import ceil, floor
import tensorflow as tf
import tensorflow_datasets as tfds

from sql_storer import SqlStorer

######################################
######### RAW SQL REQUESTS ###########
######################################
sql_democrat_weight_request = " SELECT * FROM BillInfoDB.ml_bill_info_table \
                                        where ( ( ( ( RepublicanYea/RepublicanNay )<.20 ) AND ( ( DemocratYea/DemocratNay)>1 ) ) \
                                        or    ( RepublicanYea=0 and RepublicanNay!=0 ) ) AND PrimaryCategoryName='%s';"    
                                        
                                        
sql_republican_weight_request = " SELECT * FROM BillInfoDB.ml_bill_info_table \
                                where ( ( ( ( RepublicanYea/RepublicanNay )>1 ) AND ( ( DemocratYea/DemocratNay)<.20 ) ) \
                                or    ( DemocratYea=0 and DemocratNay!=0) )      AND PrimaryCategoryName='%s';" 


ml_sql_retrieve = None

                                

def prime_raw_dataset( content_list=[] ):
    dataset, info = tfds.load('imdb_reviews/subwords8k', with_info=True,
                              as_supervised=True)
    encoder = info.features['text'].encoder
    train_dataset, test_dataset = dataset['train'], dataset['test']
    entry_list = []
    label_list = []
    encoded_entry_list = []
    hash_set = set()

    for entry in content_list:
        try:
            if(entry["content"]):   # Only add entry if it is string
                content = entry["content"].encode('utf-8')
                # Take a hash of the content to check that if there
                # are duplicates
                hash_object = hashlib.md5(content)
                hash_digest = hash_object.hexdigest()
                if hash_digest not in hash_set:
                    hash_set.add(hash_digest)
                    # If the content is new (no collision)
                    # add it to the list
                    entry_list.append(entry["content"])
                    encoded_entry_list.append( encoder.encode(entry["content"]))
                    label_list.append(entry["label"])
        except KeyError:
            continue
    return train_dataset, test_dataset, encoded_entry_list, label_list, encoder



def prime_raw_dataset_from_pkl( file_name="abortion_data_and_labels.pkl" ):
    dataset, info = tfds.load('imdb_reviews/subwords8k', with_info=True,
                              as_supervised=True)
    encoder = info.features['text'].encoder
    train_dataset, test_dataset = dataset['train'], dataset['test']
    entry_list = []
    label_list = []
    encoded_entry_list = []
    hash_set = set()
    with open(file_name, 'rb') as pkl_fp:
        content_list = pickle.load(pkl_fp)
        for entry in content_list:
            try:
                if(entry["content"]):   # Only add entry if it is string
                    content = entry["content"].encode('utf-8')
                    # Take a hash of the content to check that if there
                    # are duplicates
                    hash_object = hashlib.md5(content)
                    hash_digest = hash_object.hexdigest()
                    if hash_digest not in hash_set:
                        hash_set.add(hash_digest)
                        # If the content is new (no collision)
                        # add it to the list
                        entry_list.append(entry["content"])
                        encoded_entry_list.append( encoder.encode(entry["content"]))
                        label_list.append(entry["label"])
            except KeyError:
                continue
    return train_dataset, test_dataset, encoded_entry_list, label_list, encoder



#####################################
##### This function takes both sql 
##### responses and primes them
##### into a list with their
##### respective labels
#####################################
def prime_sql_results( rep_sql_res , dem_sql_res ):
    primed_content = []
    for row in rep_sql_res:
        primed_content.append( { "label" : 1,
                                 "content" : row.BillSynopsis } )
   
   
    for row in dem_sql_res:
        primed_content.append( { "label" : 0,
                                 "content" : row.BillSynopsis } )
                         
    return primed_content
   
#####################################
##### This function executes the 
##### necessary SQL calls 
##### for both republican 
##### and democrat parties
##### and primes the data
#####################################   
def prime_raw_dataset_from_sql( topic_name="abortion" ):
    global ml_sql_retrieve
    
    dataset, info = tfds.load('imdb_reviews/subwords8k', with_info=True,
                              as_supervised=True)
    encoder = info.features['text'].encoder
    
    if ml_sql_retrieve is None:
        ml_sql_retrieve = SqlStorer(db_name="BillInfoDB", table_name="ml_bill_info_table")
        ml_sql_retrieve.set_up_connection()

    ############################
    ###PULL REPUBLICAN RESULTS##
    ############################
    republican_results = ml_sql_retrieve.execute_raw_query( raw_query_str=( sql_republican_weight_request % topic_name ) )
    
    
    ############################
    ####PULL DEMOCRAT RESULTS###
    ############################
    democrat_results = ml_sql_retrieve.execute_raw_query( raw_query_str=( sql_democrat_weight_request %topic_name ) )
    
    ############################
    ####PRIMED RESULTS READY####
    ############################
    primed_results = prime_sql_results(rep_sql_res= republican_results, dem_sql_res= democrat_results)
    
  
    train_dataset, test_dataset = dataset['train'], dataset['test']
    entry_list = []
    label_list = []
    encoded_entry_list = []
    hash_set = set()

    for entry in primed_results:
        try:
            if(entry["content"]):   # Only add entry if it is string
                content = entry["content"].encode('utf-8')
                # Take a hash of the content to check that if there
                # are duplicates
                hash_object = hashlib.md5(content)
                hash_digest = hash_object.hexdigest()
                if hash_digest not in hash_set:
                    hash_set.add(hash_digest)
                    # If the content is new (no collision)
                    # add it to the list
                    entry_list.append(entry["content"])
                    encoded_entry_list.append( encoder.encode(entry["content"]))
                    label_list.append(entry["label"])
        except KeyError:
            continue
    return train_dataset, test_dataset, encoded_entry_list, label_list, encoder



def get_tf_datasets(
        encoded_entry_list,
        label_list,
        train_size=0.5,
        test_size=0.5
):
    """
    :param train_size: ratio size of the train set
    :return:
    """

    # Assert that train_split and test_split sum to 1 with some tolerance
    # added for floating point error
    assert (train_size + test_size) - 1.0 < 0.00001
    _length_data = len(encoded_entry_list)

    processed_data = [[], []] # List of [[train X, train y], [test_X, test_Y]]
    start = 0

    for i, split_ratio in enumerate([train_size, test_size]):
        """
        Assuming train_size: 0.5, test_size:0.5, length=100
        
        First pass: start = 0, length_data_split=50
        Second pass: start=50, length_data_split=100
        
        On first pass, goes from [0:50], then we reassign 
        previous_ind to the length so that it will go from [50:100]
        """
        length_data_split = int(_length_data * split_ratio)
        end = length_data_split + start
        print("Data boundaries: {} to {}".format(start, end))

        # X data
        raw_features = encoded_entry_list[start: end]

        tf_data = tf.keras.preprocessing.sequence.pad_sequences(
            raw_features, padding='post')

        # y features
        raw_labels = label_list[start: end]
        tf_labels = np.array(raw_labels)
        processed_data[i] = [tf_data, tf_labels]

        start = end

    return processed_data
