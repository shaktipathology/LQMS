import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateLifecycleDto } from './dto/update-lifecycle.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  list() {
    return this.documents.list();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() dto: CreateDocumentDto) {
    return this.documents.create(dto, req.user.userId, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/issue')
  issue(@Param('id') id: string, @Body('issuedTo') issuedTo: string, @Req() req: any) {
    return this.documents.issueControlledCopy(id, issuedTo, req.user.userId, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/obsolete')
  obsolete(@Param('id') id: string, @Req() req: any) {
    return this.documents.updateLifecycle(id, {
      lifecycle: 'obsolete',
      effectiveFrom: new Date().toISOString().slice(0, 10),
    }, req.user.userId, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/lifecycle')
  updateLifecycle(
    @Param('id') id: string,
    @Body() dto: UpdateLifecycleDto,
    @Req() req: any,
  ) {
    return this.documents.updateLifecycle(id, dto, req.user.userId, req);
  }
}
