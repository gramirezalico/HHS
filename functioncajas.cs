try
{
    var newRow = new Ice.Tables.UD33();
    newRow.Company = this.Session.CompanyID;
    newRow.Key1 = this.Key1;
    newRow.Key2 = "c";
    newRow.Key3 = "a";
    newRow.Key4 = "j";
    newRow.Key5 = "a";
    
    newRow.Number01 = this.Number01;
    newRow.Number02= this.Number02;
    newRow.Number03 = this.Number03;
    newRow.Number04 = this.Number04;
    newRow.ShortChar01 = this.ShortChar01;
    newRow.ShortChar02 = this.ShortChar02;
        newRow.ShortChar03 = this.ShortChar03;
            newRow.ShortChar04= this.ShortChar04;
    newRow.Number05 = this.Number05;
    newRow.ShortChar05 = this.ShortChar05;
    newRow.ShortChar06 = this.ShortChar06;
    newRow.ShortChar07 = this.ShortChar07;
    DateTime date =  DateTime.Now;
    var d = date.Date;
    newRow.Date01 = d;
    this.Db.AddObject(newRow);
    this.Db.SaveChanges();
    this.status = true;
    this.message = "";
}
catch (Exception Ex)
{
    this.status = false;
    this.message = Ex.ToString();
}