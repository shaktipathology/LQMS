import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { clauseEvidence } from '@labqms/compliance';

@UseGuards(AuthGuard('jwt'))
@Controller('compliance-map')
export class ComplianceController {
  @Get()
  getClause(@Query('clause') clause: string) {
    if (clause) {
      return { clause, evidence: clauseEvidence[clause] || [] };
    }
    return clauseEvidence;
  }
}
