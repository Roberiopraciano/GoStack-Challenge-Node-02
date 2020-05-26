import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionList = await this.find();

    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const balanceFinal = transactionList.reduce(
      (accumulator: Balance, current: Transaction) => {
        if (current.type === 'income') {
          accumulator.income += Number(current.value);
        } else if (current.type === 'outcome') {
          accumulator.outcome += Number(current.value);
        }
        accumulator.total = accumulator.income - accumulator.outcome;
        return accumulator;
      },
      balance,
    );
    return balanceFinal;
  }
}

export default TransactionsRepository;
