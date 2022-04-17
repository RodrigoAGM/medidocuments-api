import { Hospital } from '../../models/hospital.model';
import { IRequirement } from '../../models/requirement';
import { User } from '../../models/user.model';
import { FabricNetwork } from '../../network/network';
import { Payload, Result } from '../../types/types';
import { UserValidator } from '../user/user.validator';
import { handleRequirementError } from './requirement.error';
import { IRequirementCreate } from './requirement.interface';
import { RequirementValidator } from './requirement.validator';

export class RequirementService {
  async create(payload: Payload, data: IRequirementCreate): Promise<Result<IRequirement>> {
    try {
      // Get user hospital
      const userData = await UserValidator.exists(payload.id);
      const hospitalId = userData.hospital;

      // Add data to transaction
      data.chemistId = payload.id;
      data.hospitalId = (hospitalId as string);

      const validated = await RequirementValidator.validateCreateInput(data);

      // Check if chemist is registered on network
      const chemistExist = await FabricNetwork.checkIfUserExists(payload.id);

      if (!chemistExist) {
        // If user chemist not exist, register chemist
        await FabricNetwork.registerUser(payload.id);
      }

      const network = await FabricNetwork.connectToNetwork(payload.id);

      const args = [JSON.stringify(validated)];

      const response = await FabricNetwork.invoke(network, true, 'createRequirement', args);

      // Disconnect network
      FabricNetwork.disconnect();

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al crear el requerimiento.'));
    }
  }

  async getAll(payload: Payload): Promise<Result<IRequirement[]>> {
    try {
      // Check if chemist is registered on network
      const chemistExist = await FabricNetwork.checkIfUserExists(payload.id);

      if (!chemistExist) {
        // If user chemist not exist, register chemist
        await FabricNetwork.registerUser(payload.id);
      }

      const network = await FabricNetwork.connectToNetwork(payload.id);

      const response = await FabricNetwork.invoke(network, true, 'getAllRequirements', []);

      // Disconnect network
      FabricNetwork.disconnect();

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al obtener los requerimientos.'));
    }
  }

  async getById(payload: Payload, id: string): Promise<Result<IRequirement>> {
    try {
      // Check if chemist is registered on network
      const chemistExist = await FabricNetwork.checkIfUserExists(payload.id);

      if (!chemistExist) {
        // If user chemist not exist, register chemist
        await FabricNetwork.registerUser(payload.id);
      }

      const network = await FabricNetwork.connectToNetwork(payload.id);

      const args = [id];

      const response = await FabricNetwork.invoke(network, true, 'getRequirementById', args);

      // Disconnect network
      FabricNetwork.disconnect();

      // Get chemist data
      const chemist = await User.findById(response.data?.chemistId ?? '');

      // Get hospital data
      const hospital = await Hospital.findById(response.data?.hospitalId ?? '');

      const res: Result<IRequirement> = {
        success: true,
        data: {
          ...response.data,
          chemist,
          hospital,
        },
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al obtener el requerimiento.'));
    }
  }

  async getAllFromHospital(payload: Payload): Promise<Result<IRequirement[]>> {
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

      const args = [hospitalId];

      const response = await FabricNetwork.invoke(network, true, 'getAllRequirementsFromHospital', args);

      // Disconnect network
      FabricNetwork.disconnect();

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al obtener los requerimientos.'));
    }
  }

  async getByIdFromHospital(payload: Payload, id: string): Promise<Result<IRequirement>> {
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

      const response = await FabricNetwork.invoke(network, true, 'getRequirementByIdFromHospital', args);

      // Disconnect network
      FabricNetwork.disconnect();

      // Get chemist data
      const chemist = await User.findById(response.data?.chemistId ?? '');

      // Get hospital data
      const hospital = await Hospital.findById(hospitalId);

      const res: Result<IRequirement> = {
        success: true,
        data: {
          ...response.data,
          chemist,
          hospital,
        },
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al obtener el requerimiento.'));
    }
  }
}
