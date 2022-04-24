import { Hospital } from '../../models/hospital.model';
import { User } from '../../models/user.model';
import { FabricNetwork } from '../../network/network';
import { Payload, Result } from '../../types/types';
import { UserValidator } from '../user/user.validator';
import { handleTechnicalDocumentError } from './document.error';
import { ITechnicalDocumentCreate } from './document.interface';
import { TechnicalDocumentValidator } from './document.validator';
import { ITechnicalDocument } from '../../models/technical.document.model';

export class TechnicalDocumentService {
  async create(payload: Payload, data: ITechnicalDocumentCreate): Promise<Result<string>> {
    try {
      // Add data to transaction
      data.digemidChemistId = payload.id;

      const validated = await TechnicalDocumentValidator.validateCreateInput(data);

      // Check if chemist is registered on network
      const chemistExist = await FabricNetwork.checkIfUserExists(payload.id);

      if (!chemistExist) {
        // If user chemist not exist, register chemist
        await FabricNetwork.registerUser(payload.id);
      }

      const network = await FabricNetwork.connectToNetwork(payload.id);

      const args = [JSON.stringify(validated)];

      const response = await FabricNetwork.invoke(network, true, 'createTechnicalDocument', args);

      // Disconnect network
      FabricNetwork.disconnect();

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleTechnicalDocumentError(error, 'Ocurrió un error al crear la guía de remisión.'));
    }
  }

  async getById(payload: Payload, id: string): Promise<Result<ITechnicalDocument>> {
    try {
      // Check if chemist is registered on network
      const chemistExist = await FabricNetwork.checkIfUserExists(payload.id);

      if (!chemistExist) {
        // If user chemist not exist, register chemist
        await FabricNetwork.registerUser(payload.id);
      }

      const network = await FabricNetwork.connectToNetwork(payload.id);

      const args = [id, ''];

      const response = await FabricNetwork.invoke(network, false, 'getTechnicalDocumentById', args);

      // Disconnect network
      FabricNetwork.disconnect();

      // Get chemist data
      const digemidChemist = await User.findById(response.data?.digemidChemistId ?? '');

      // Get hospital data
      const hospital = await Hospital.findById(response.data?.hospitalId ?? '');

      const res: Result<ITechnicalDocument> = {
        success: true,
        data: {
          ...response.data,
          digemidChemist,
          hospital,
        },
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(handleTechnicalDocumentError(error, 'Ocurrió un error al obtener el documento técnico.'));
    }
  }

  async getByIdFromHospital(payload: Payload, id: string): Promise<Result<ITechnicalDocument>> {
    try {
      // Get user hospital
      const userData = await UserValidator.exists(payload.id);
      const hospitalId = userData.hospital as string;

      // Check if chemist is registered on network
      const chemistExist = await FabricNetwork.checkIfUserExists(payload.id);

      if (!chemistExist) {
        // If user chemist not exist, register chemist
        await FabricNetwork.registerUser(payload.id);
      }

      const network = await FabricNetwork.connectToNetwork(payload.id);

      const args = [id, hospitalId];

      const response = await FabricNetwork.invoke(network, false, 'getTechnicalDocumentById', args);

      // Disconnect network
      FabricNetwork.disconnect();

      // Get chemist data
      const digemidChemist = await User.findById(response.data?.digemidChemistId ?? '');

      // Get hospital data
      const hospital = await Hospital.findById(hospitalId);

      const res: Result<ITechnicalDocument> = {
        success: true,
        data: {
          ...response.data,
          digemidChemist,
          hospital,
        },
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(handleTechnicalDocumentError(error, 'Ocurrió un error al obtener el documento técnico.'));
    }
  }
}
