import { Status, Unit, User } from 'src/libs/database/entities';
import { RequestTransaction } from 'src/libs/database/entities/request-transaction.entity';
import { CreateDocumentOriginInfoDto } from 'src/modules/document/document-origin-info/dto/create-document-origin-info.dto';

export class CreateOtherRegisteredRecordDto extends CreateDocumentOriginInfoDto {
  // owner_unit: Unit;
  // request_transaction: RequestTransaction;
  // record_status: Status;
  requested_from: Unit
  // requested_by: Unit
  // isDeleted: boolean;
}
