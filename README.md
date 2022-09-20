# Lottery SC wiht hardhat


Run the SC Test with:

```shell
npx hardhat test
```

#### Public methods:
```enter```: register sender account to participate
```chooseWinner```: choose a winner (only callable by SC owner address only)

#### Private methods:
```checkIfAddressIsInLottery```: check if user is already registered
```random```: get a random position in the array

#### Modifiers:
```onlyUnregistered```: use of method to check if user is already registered
