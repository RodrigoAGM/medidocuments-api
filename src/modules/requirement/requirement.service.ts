import { IRequirement } from '../../models/requirement.model';
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

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al crear el requerimiento.'));
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

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al obtener los requerimientos.'));
    }
  }

  async getByIdFromHospital(payload: Payload, id: string): Promise<Result<IRequirement[]>> {
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

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al obtener los requerimientos.'));
    }
  }
}
