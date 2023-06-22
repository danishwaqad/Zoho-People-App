import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
@Controller()
export class ZohoController {
  private refreshToken =
    '1000.3a3fd204f0f560344ca825235e1f0818.983e311efa7ab43a13d49edf6a989679';
  private clientId = '1000.NITZ3ES7IO7EF64D5Z19SP3PHV3VEU';
  private clientSecret = '25da0515428eb9d3acaf473adee313f4193ac8e072';
  private redirectUri = 'https://localhost/zoho';
  private accessToken: string;
  private apiResponse: any;
  constructor() {
    this.generateAccessToken();
  }

  private async generateAccessToken() {
    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      null,
      {
        params: {
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    );

    this.accessToken = response.data.access_token;
    console.log('Access Token:', this.accessToken);
  }

  private async generateRefreshToken(code: string) {
    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      null,
      {
        params: {
          code: code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    );

    this.accessToken = response.data.access_token;
  }

  @Get('authorize-token')
  async authorizeToken(@Query('code') code: string) {
    await this.generateRefreshToken(code);
    return {
      message: 'Refresh token generated successfully!',
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }

  @Post('zoho')
  async insertRecord(
    @Body('EmployeeID') EmployeeID: string,
    @Body('FirstName') FirstName: string,
    @Body('LastName') LastName: string,
    @Body('EmailID') EmailID: string,
    @Body('Designation') Designation: string,
    @Body('Department') Department: string,
    @Res() res: Response,
  ) {
    const data = {
      inputData: JSON.stringify({
        EmployeeID: EmployeeID,
        FirstName: FirstName,
        LastName: LastName,
        EmailID: EmailID,
        Designation: Designation,
        Department: Department,
      }),
    };
    try {
      const response = await axios.post(
        'https://people.zoho.com/people/api/forms/json/employee/insertRecord',
        null,
        {
          params: data,
          headers: {
            Authorization: `Zoho-oauthtoken ${this.accessToken}`,
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      console.log('Zoho API Response:', response.data);

      if (response.status === 200) {
        this.apiResponse = response.data;
        // Send the response data as a JSON object
        res.json(response.data);
      } else {
        const errorMessage =
          response && response.data && response.data.message
            ? response.data.message
            : 'Error occurred during data insertion';
        res.send({ message: errorMessage });
      }
    } catch (error) {
      console.error('Error inserting data:', error.response.data);
      res.send({ message: 'Failed to insert data!' });
    }
  }
}
