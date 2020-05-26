import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);
    const transactionsRepositoryBalance = getCustomRepository(
      TransactionsRepository,
    );
    const findTransactionBalance = transactionsRepositoryBalance.getBalance();

    if (type === 'outcome' && (await findTransactionBalance).total < value) {
      throw new AppError('balance is not enough', 400);
    }

    const findcategoryRegister = await categoryRepository.findOne({
      where: { title: category },
    });

    const categoryRegister = categoryRepository.create({
      title: category,
    });
    if (!findcategoryRegister) {
      await categoryRepository.save(categoryRegister);
    }
    const categoryregister = findcategoryRegister || categoryRegister;

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryregister,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
