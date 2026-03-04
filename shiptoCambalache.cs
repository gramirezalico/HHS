try
{

    var row = this.Db.UD33.FirstOrDefault(r=> r.Company == this.Session.CompanyID && r.Key5 == pack.ToString() && r.Key4 == "j"&& r.Key3 == "a");
    if(row ==null){
    var newRow = new Ice.Tables.UD33();
    newRow.Company = this.Session.CompanyID;
    newRow.Key1 = this.order.ToString();
    newRow.Key2 = "c";
    newRow.Key3 = "a";
    newRow.Key4 = "j";
    newRow.Key5 = this.pack.ToString();
    DateTime date =  DateTime.Now;
    var d = date.Date;
    newRow.Date01 = d;
    this.Db.AddObject(newRow);
    this.Db.SaveChanges();}
    this.status = true;
    this.message = "";
}
catch (Exception Ex)
{
    this.status = false;
    this.message = Ex.ToString();
}