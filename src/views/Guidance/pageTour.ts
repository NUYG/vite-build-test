import {salesDashboardTour} from "@/views/Guidance/tourData/salesDashboard";
import type {tourOptions} from "@/views/Guidance/shepherd";
import {
    newSalesCusTour,
    salesMobileCusCreate,
    salespjPickTour
} from "@/views/Guidance/tourData/newSalesTour";
import {salesSPDetailTour} from "@/views/Guidance/tourData/saleProcessDetailSales";
import {salesDetailCustomerTour} from "@/views/Guidance/tourData/firstCusDetailSales";
import {salesPairingUnitTour} from "@/views/Guidance/tourData/firstPairingUnit";

export const pageTour: {[index: string]: tourOptions} = {
    'Sales Dashboard': salesDashboardTour,
    'New Sales Project Pick': salespjPickTour,
    'New Sales Cus': newSalesCusTour,
    'New Sales Create Cus Mobile': salesMobileCusCreate,
    'Sales Pairing Unit Tour': salesPairingUnitTour,
    'Sales SP Detail Tour': salesSPDetailTour,
    'Sales Customer Detail Tour': salesDetailCustomerTour,
}

