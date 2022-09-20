import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat"; 
import { SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { Lottery } from "../typechain-types";

const minimumBet = '10000000000000000',
      belowPriceBet = '10000000000000',
      minimumBetError = 'The min bet is 0.01 ETH',
      alreadyRegisteredError = 'You are alredy registered',
      isNotManagerError = 'You are not the manager',
      playersEmptyError = 'There are not players';

describe("Lock", function () {
  let lottery: Lottery, owner: SignerWithAddress, otherAccount1: SignerWithAddress, otherAccount2: SignerWithAddress;

  beforeEach(
    async  () => {
      [owner, otherAccount1, otherAccount2] = await ethers.getSigners();
      const Lottery = await ethers.getContractFactory("Lottery", owner);
      lottery = await Lottery.deploy();
    }
  )

  describe("Deployment", function () {
    it("Should deploy with owner address", async function () {
      const manager = await lottery.manager();
      expect(manager).to.equal(owner.address);
    });
  });

  describe("Enter to lottery", function () {
    it("Should return error value is lower than min", async function () {
      const enterToLottery = lottery.connect(otherAccount1).enter({ value: belowPriceBet });
      await expect(enterToLottery).to.be.revertedWith(minimumBetError);  
    });

    it("Should subscribe if value is higher than min", async function () {
      await lottery.connect(otherAccount1).enter({ value: minimumBet });
      const checkAddr = await lottery.checkIfAddressIsInLottery(otherAccount1.address);
      expect(checkAddr).to.be.true;
    });

    it("Should not subscribe with a registered account", async function () {
      await lottery.connect(otherAccount1).enter({ value: minimumBet });
      const subscriptionWithUsedAccount = lottery.connect(otherAccount1).enter({ value: minimumBet });
      await expect(subscriptionWithUsedAccount).to.be.rejectedWith(alreadyRegisteredError);
    });
  });

  describe("Choose a winner", function () {
    it("Should reject request with non manager account", async() => {
      const choosedWinner = lottery.connect(otherAccount1).chooseWinner();
      await expect(choosedWinner).to.be.revertedWith(isNotManagerError);
    });

    it("Should return error when players array are empty", async() => {
      const choosedWinner =  lottery.chooseWinner();
      await expect(choosedWinner).to.be.revertedWith(playersEmptyError);
    });

    it("Should return the address of the winner", async() => {
      const players = [otherAccount1.address, otherAccount2.address];
      await lottery.connect(otherAccount1).enter({ value: minimumBet });
      await lottery.connect(otherAccount2).enter({ value: minimumBet });
      const choosedWinner = await lottery.chooseWinner();
      const existWinner = players.includes(choosedWinner);
       expect(existWinner).to.be.true;
    });
  });
});
