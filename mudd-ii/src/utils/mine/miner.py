import hashlib
import requests

import sys
import json

import time


def proof_of_work(block, difficulty):
    """
    Simple Proof of Work Algorithm
    Stringify the block and look for a proof.
    Loop through possibilities, checking each one against `valid_proof`
    in an effort to find a number that is a valid proof
    :return: A valid proof for the provided block
    """
    block_string = json.dumps(block, sort_keys=True)
    proof = 0
    while valid_proof(block_string, proof, difficulty) is False:
        proof += 1
    return proof


def valid_proof(block_string, proof, difficulty):
    """
    Validates the Proof:  Does hash(block_string, proof) contain 6
    leading zeroes?  Return true if the proof is valid
    :param block_string: <string> The stringified block to use to
    check in combination with `proof`
    :param proof: <int?> The value that when combined with the
    stringified previous block results in a hash that has the
    correct number of leading zeroes.
    :return: True if the resulting hash is a valid proof, False otherwise
    """
    guess = f'{block_string}{proof}'.encode()
    guess_hash = hashlib.sha256(guess).hexdigest()
    # if guess_hash[:6] == '000000':
    #     print(guess_hash)
    return guess_hash[:difficulty] == '0'*difficulty


if __name__ == '__main__':
    # What is the server address? IE `python3 miner.py https://server.com/api/`
    if len(sys.argv) > 1:
        node = sys.argv[1]
    else:
        node = "https://lambda-treasure-hunt.herokuapp.com/api/bc"

    # set header with API key/token
    token = 'Token 1c195b27c58c36db25d1edf9e08da6bb257a4c92'
    headers = {'Authorization': token}

    coins = 0
    cd = 15
    # Run forever until interrupted
    while True:
        start = time.time()
        local_time = time.ctime(start)
        print(f'Started mining at: {local_time}')
        
        while time.time() < start + cd:
            1+1
        
        r = requests.get(url=node + "/last_proof/", headers=headers)
        # Handle non-json response
        try:
            data = r.json()
        except ValueError:
            print("Error:  Non-json response")
            print("Response returned:")
            print(r)
            break

        # TODO: Get the block from `data` and use it to look for a new proof
        # new_proof = ???
        print(data)

        #reset cd = data.data.cooldown?????------
        cd = data['cooldown']

        new_proof = proof_of_work(data['proof'], data['difficulty'])
        end = time.time()
        print(f'Found proof! elapsed time: {end - start}')

        # When found, POST it to the server {"proof": new_proof, "id": id}
        post_data = {"proof": new_proof}
        print(post_data)

        while time.time() < start + cd:
            1+1

        
        r = requests.post(url=node + "/mine/", json=post_data, headers=headers)
        data = r.json()

        #reset cd = data.data.cooldown?????------
        cd = data['cooldown']

        # TODO: If the server responds with a 'message' 'New Block Forged'
        # add 1 to the number of coins mined and print it.  Otherwise,
        # print the message from the server.

        message = data['messages']
        print(data)
        
        # if message == 'New Block Forged':
        #     coins = coins + 1
        #     print(f'Coins: {coins}')
        # else:
        #     print(f'{message}')