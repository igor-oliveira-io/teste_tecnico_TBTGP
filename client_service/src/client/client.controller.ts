import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiBody({
    description: 'Information to create a new client',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'johndoe@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Client successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error while creating the client.',
  })
  async createClient(@Body() data: { name: string; email: string }) {
    return this.clientService.createClient(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all clients' })
  @ApiResponse({
    status: 200,
    description: 'List of clients.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error while listing clients.',
  })
  async listClients() {
    return this.clientService.listClients();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Client ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Client found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found.',
  })
  async getClient(@Param('id') clientId: string) {
    return this.clientService.getClientWithVouchers(Number(clientId));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Client ID',
  })
  @ApiBody({
    description: 'Data to update the client',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'johndoe@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Client successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error while updating the client.',
  })
  async updateClient(
    @Param('id') clientId: string,
    @Body() data: { name: string; email: string },
  ) {
    return this.clientService.updateClient(Number(clientId), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Client ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Client successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error while deleting the client.',
  })
  async deleteClient(@Param('id') clientId: string) {
    return this.clientService.deleteClient(Number(clientId));
  }

  @Post(':id/vouchers/:voucherId')
  @ApiOperation({ summary: 'Associate a voucher with a client' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Client ID',
  })
  @ApiParam({
    name: 'voucherId',
    type: 'string',
    description: 'Voucher ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher successfully associated with the client.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error while associating the voucher.',
  })
  async associateVoucher(
    @Param('id') clientId: string,
    @Param('voucherId') voucherId: string,
  ) {
    return this.clientService.associateVoucher(
      Number(clientId),
      Number(voucherId),
    );
  }

  @Post(':id/vouchers/:voucherId/dissociate')
  @ApiOperation({ summary: 'Dissociate a voucher from a client' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Client ID',
  })
  @ApiParam({
    name: 'voucherId',
    type: 'string',
    description: 'Voucher ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher successfully dissociated from the client.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error while dissociating the voucher.',
  })
  async dissociateVoucher(
    @Param('id') clientId: string,
    @Param('voucherId') voucherId: string,
  ) {
    return this.clientService.dissociateVoucher(
      Number(clientId),
      Number(voucherId),
    );
  }
}
