import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application } from './schemas/application.schema';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
  ) {}

  async create(createApplicationDto: any): Promise<Application> {
    const createdApplication = new this.applicationModel(createApplicationDto);
    return createdApplication.save();
  }

  async findAll(): Promise<Application[]> {
    return this.applicationModel.find().exec();
  }

  async findOne(id: string): Promise<Application> {
    return this.applicationModel.findById(id).exec();
  }

  async update(id: string, updateApplicationDto: any): Promise<Application> {
    return this.applicationModel
      .findByIdAndUpdate(id, updateApplicationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Application> {
    return this.applicationModel.findByIdAndDelete(id).exec();
  }
}
