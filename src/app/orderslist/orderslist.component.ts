import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '@app/order.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderslistComponent implements OnInit {

  Orders: any = [];

  OrderForm: FormGroup;

  modalReference: any;

  HeaderTitle: any;

  constructor(public fb: FormBuilder,
    private modalService: NgbModal,
    public orderSrvc: OrderService) {

  }

  ngOnInit(): void {
    this.GetOrders();
  }

  // API Call to get Orders list
  GetOrders() {
    this.orderSrvc.getOrders().subscribe((orders: any) => {
      this.Orders = orders;
    });
  }

  // To get Order Form
  CreateOrderForm(OrderData: any) {
    this.OrderForm = this.fb.group({
      OrdId: [OrderData.OrdId],
      OrdNo: [OrderData.OrdNo, Validators.required],
      DDate: [OrderData.DDate, Validators.required],
      CustName: [OrderData.CustName, Validators.required],
      Adrs: [OrderData.Adrs, Validators.required],
      PhNo: [OrderData.PhNo, Validators.required],
      OrdTotal: [OrderData.OrdNo, Validators.required]
    });
  }
  // To View Order data 
  ViewOrder(ordercreationTemp: any, OrderData: any) {
    this.getUserById(ordercreationTemp, OrderData.OrdId, 'view');
  }

  // API Call to get Order Data
  getUserById(ordercreationTemp: any, OrderId: any, type: string) {
    this.orderSrvc.getOrderById(OrderId).subscribe((val: any) => {
      this.CreateOrderForm(val);
      if (type === 'view') {
        this.OrderForm.disable();
      }
      this.HeaderTitle = 'Order' + ' #' + val.OrdId;
      this.CreateModal(ordercreationTemp);
    });
  }

  // To open new Order Modal
  AddOrder(ordercreationTemp: any) {
    this.CreateOrderForm({});
    this.HeaderTitle = 'New Order';
    this.CreateModal(ordercreationTemp);
  }

  EditOrder(ordercreationTemp: any, OrderData: any, index: number) {
    this.getUserById(ordercreationTemp, OrderData.OrdId, 'edit');
  }

  CreateModal(ModalTemp: any) {
    this.modalReference = this.modalService.open(ModalTemp, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
  }

  ConfirmDeleteOrder(ConfirmationDialog: any, index: number) {
    this.modalService.open(ConfirmationDialog, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result === 'yes') {
        this.DeleteOrder(index);
      } else {
        ConfirmationDialog.dismiss();
      }
    });
  }

  DeleteOrder(index: number) {
    this.orderSrvc.DeleteOrder(this.Orders[index]).subscribe((val: any) => {
      this.Orders = val;
    });
  }

  SaveOrder(modal: any) {
    let OrderData: any = this.OrderForm.value;
    if (this.OrderForm.valid) {
      if (OrderData.OrdId === null) {
        this.CreateOrder(modal, OrderData)
      } else {
        this.UpdateOrder(modal, OrderData)
      }
    }
  }

  CreateOrder(modalref, OrderData: any) {
    this.orderSrvc.CreateOrder(OrderData).subscribe((val: any) => {
      console.log(val);
      this.Orders.push(val);
      modalref.dismiss();
    });
  }

  UpdateOrder(modalref, OrderData: any) {
    this.orderSrvc.UpdateOrder(OrderData).subscribe((val: any) => {
      let index: number = this.Orders.findIndex((val: any) => {
        return val.OrdNo === this.OrderForm.controls['OrdNo'].value;
      });
      if (index !== -1) {
        this.Orders[index] = val;
        modalref.dismiss();
      }
    });
  }


}
