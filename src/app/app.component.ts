import { Component, OnInit } from '@angular/core';
import * as faker from 'faker';
import { Contact } from './models/contact.model';
import { ExcelService } from './services/excel/excel.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  importContacts: Contact[] = [];
  exportContacts: Contact[] = [];

  constructor(private excelSrv: ExcelService) { }

  ngOnInit(): void {
    for (let index = 0; index < 10; index++) {
      const contact = new Contact();
      contact.detalleParticipante = faker.name.jobDescriptor();
      contact.nombre = faker.name.findName();
      contact.rfcClave = faker.random.number();
      contact.region = faker.address.state();
      contact.sucursal = faker.address.city();
      contact.tipoNomina = faker.random.number();
      contact.tipoContrato = faker.random.number();
      contact.tipoParticipante = faker.random.number();
      contact.tipoPuesto = faker.random.number();
      contact.fechaIngreso = faker.date.past();
      contact.aportacionEmpleado = faker.finance.amount();
      contact.aportacionVoluntaria = faker.finance.amount();
      contact.email = faker.internet.email();
      this.exportContacts.push(contact);
    }

  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;
      const data = <any[]>this.excelSrv.importFromFile(bstr);

      const header: string[] = Object.getOwnPropertyNames(new Contact());
      const importedData = data.slice(1, -1);

      this.importContacts = importedData.map(arr => {
        const obj = {};
        for (let i = 0; i < header.length; i++) {
          const k = header[i];
          obj[k] = arr[i];
        }
        return <Contact>obj;
      })

    };
    reader.readAsBinaryString(target.files[0]);

  }

  exportData(tableId: string) {
    this.excelSrv.exportToFile("contacts", tableId);
  }

}
