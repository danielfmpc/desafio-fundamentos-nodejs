import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const initialBalance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const balance = this.transactions.reduce((accumulator, currentValue) => {
      switch (currentValue.type) {
        case 'income':
          return {
            ...accumulator,
            income: currentValue.value + accumulator.income,
            total:
              currentValue.value + accumulator.income - accumulator.outcome,
          };
        case 'outcome':
          return {
            ...accumulator,
            outcome: currentValue.value + accumulator.outcome,
            total:
              accumulator.income - currentValue.value + accumulator.outcome,
          };
        default:
          return accumulator;
      }
    }, initialBalance);

    return balance;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
