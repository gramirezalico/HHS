/*  
 * Disclaimer!!! 
 * This is not a real query being executed, but a simplified version for general vision. 
 * Executing it with any other tool may produce a different result. 
 */

select  
	[MtlQueue].[Company] as [MtlQueue_Company], 
	[MtlQueue].[Plant] as [MtlQueue_Plant], 
	[MtlQueue].[Quantity] as [MtlQueue_Quantity], 
	[MtlQueue].[PartNum] as [MtlQueue_PartNum], 
	[MtlQueue].[MtlQueueSeq] as [MtlQueue_MtlQueueSeq], 
	[MtlQueue].[SelectedByEmpID] as [MtlQueue_SelectedByEmpID], 
	[MtlQueue].[OrderNum] as [MtlQueue_OrderNum], 
	[Customer].[CustID] as [Customer_CustID], 
	[MtlQueue].[LotNum] as [MtlQueue_LotNum], 
	[MtlQueue].[FromBinNum] as [MtlQueue_FromBinNum] 

from Erp.MtlQueue as [MtlQueue]
left outer join Erp.OrderDtl as [OrderDtl] on 
	  MtlQueue.Company = OrderDtl.Company
	and  MtlQueue.OrderNum = OrderDtl.OrderNum
	and  MtlQueue.OrderLine = OrderDtl.OrderLine
left outer join Erp.Customer as [Customer] on 
	  OrderDtl.Company = Customer.Company
	and  OrderDtl.CustNum = Customer.CustNum
where (MtlQueue.Plant = @Plant  
and MtlQueue.SelectedByEmpID = @EmpID)