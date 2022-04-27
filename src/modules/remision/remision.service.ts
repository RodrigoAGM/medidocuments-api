import { Hospital } from '../../models/hospital.model';
import { User } from '../../models/user.model';
import { FabricNetwork } from '../../network/network';
import { Payload, Result } from '../../types/types';
import { UserValidator } from '../user/user.validator';
import { handleRemisionError } from './remision.error';
import { IRemisionCreate } from './remision.interface';
import { RemisionValidator } from './remision.validator';
import { IRemision } from '../../models/remision';

export class RemisionService {
  async create(payload: Payload, data: IRemisionCreate): Promise<Result<string>> {
    try {
      // Add data to transaction
      data.digemidChemistId = payload.id;

      const validated = await RemisionValidator.validateCreateInput(data);

      // Check if chemist is registered on network
      const chemistExist = await FabricNetwork.checkIfUserExists(payload.id);

      if (!chemistExist) {
        // If user chemist not exist, register chemist
        await FabricNetwork.registerUser(payload.id);
      }

      const network = await FabricNetwork.connectToNetwork(payload.id);

      const args = [JSON.stringify(validated)];

      const response = await FabricNetwork.invoke(network, true, 'createRemision', args);

      // Disconnect network
      FabricNetwork.disconnect();

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleRemisionError(error, 'Ocurrió un error al crear la guía de remisión.'));
    }
  }

  async confirm(
    payload: Payload,
    remisionId: string,
    observations: string
  ): Promise<Result<string>> {
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

      const args = [remisionId, hospitalId, observations];

      const response = await FabricNetwork.invoke(network, true, 'confirmRemision', args);

      // Disconnect network
      FabricNetwork.disconnect();

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleRemisionError(error, 'Ocurrió un error al crear la guía de remisión.'));
    }
  }

  async getById(payload: Payload, id: string): Promise<Result<IRemision>> {
    try {
      // Check if chemist is registered on network
      const chemistExist = await FabricNetwork.checkIfUserExists(payload.id);

      if (!chemistExist) {
        // If user chemist not exist, register chemist
        await FabricNetwork.registerUser(payload.id);
      }

      const network = await FabricNetwork.connectToNetwork(payload.id);

      const args = [id, ''];

      const response = await FabricNetwork.invoke(network, false, 'getRemisiontById', args);

      // Disconnect network
      FabricNetwork.disconnect();

      // Get chemist data
      const digemidChemist = await User.findById(response.data?.digemidChemistId ?? '');

      // Get hospital data
      const hospital = await Hospital.findById(response.data?.hospitalId ?? '');

      const res: Result<IRemision> = {
        success: true,
        data: {
          ...response.data,
          digemidChemist,
          hospital,
        },
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(handleRemisionError(error, 'Ocurrió un error al obtener la guía de remisión.'));
    }
  }

  async getByIdFromHospital(payload: Payload, id: string): Promise<Result<IRemision>> {
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

      const response = await FabricNetwork.invoke(network, false, 'getRemisiontById', args);

      // Disconnect network
      FabricNetwork.disconnect();

      // Get chemist data
      const digemidChemist = await User.findById(response.data?.digemidChemistId ?? '');

      // Get hospital data
      const hospital = await Hospital.findById(hospitalId);

      const res: Result<IRemision> = {
        success: true,
        data: {
          ...response.data,
          digemidChemist,
          hospital,
        },
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(handleRemisionError(error, 'Ocurrió un error al obtener la guía de remisión.'));
    }
  }

  async getByLotNumber(
    payload: Payload, lotNumber: string
  ): Promise<Result<IRemision | undefined>> {
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

      const args = [hospitalId, lotNumber];

      const response = await FabricNetwork.invoke(network, false, 'getRemisiontByLotNumber', args);

      // Disconnect network
      FabricNetwork.disconnect();

      if (!response.data) {
        return Promise.resolve({ success: true, data: undefined });
      }

      // Get chemist data
      const digemidChemist = await User.findById(response.data?.digemidChemistId ?? '');

      // Get hospital data
      const hospital = await Hospital.findById(response.data?.hospitalId ?? '');

      const res: Result<IRemision> = {
        success: true,
        data: {
          ...response.data,
          digemidChemist,
          hospital,
        },
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(handleRemisionError(error, 'Ocurrió un error al obtener la guía de remisión.'));
    }
  }
}
