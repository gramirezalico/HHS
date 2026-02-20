// **************************************************
// Custom code for UD05Form
// Created: 10/5/2020 6:44:48 PM
// **************************************************
using Erp.Proxy.BO;
using Ice.BO;
using Ice.Lib.Customization;
using Ice.Lib.Framework;
using Ice.Proxy.BO;
using Ice.UI.App.UD05Entry;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Windows.Forms;

#region CustomCode
public class Script
{
    // ** Wizard Insert Location - Do Not Remove 'Begin/End Wizard Added Module Level Variables' Comments! **
    // Begin Wizard Added Module Level Variables **

    // End Wizard Added Module Level Variables **

    // Add Custom Module Level Variables Here **

    //--- variable generica

    AdeLaunch launch;
    MainTransaction mainTransaction;

    public void InitializeCustomCode()
	{

        // ** Wizard Insert Location - Do not delete 'Begin/End Wizard Added Variable Initialization' lines **
        // Begin Wizard Added Variable Initialization

        // End Wizard Added Variable Initialization

        // Begin Wizard Added Custom Method Calls

        // End Wizard Added Custom Method Calls
        //program = Main.PreLanzado("DesarrolloCajasHH");
        //ajuste = Main.InvocarMetodo(program, "LaunchForm", oTrans, csm, UD05Form);
        launch = new AdeLaunch(oTrans, csm, UD05Form);
	}

	public void DestroyCustomCode()
	{
		// ** Wizard Insert Location - Do not delete 'Begin/End Wizard Added Object Disposal' lines **
		// Begin Wizard Added Object Disposal

		// End Wizard Added Object Disposal

		// Begin Custom Code Disposal

		// End Custom Code Disposal
	}

	private void UD05Form_Load(object sender, EventArgs args)
	{
        //Main.InvocarMetodo(program, "LoadForm", ajuste);
        launch.LoadForm();
	}
}
#endregion

public class AdeLaunch
{
    private CustomScriptManager _csm;
    private Transaction _oTrans;
    private UD05Form _Ud05Form;
    private MainTransaction _mainTransaction;

    public UD05Form Ud05Form { get { return _Ud05Form; } set { _Ud05Form = value; } }

    public Transaction oTrans { get { return _oTrans; } set { _oTrans = value; } }

    public CustomScriptManager Csm { get { return _csm; } set { _csm = value; } }

    public MainTransaction mainTransaction { get { return _mainTransaction; } set { _mainTransaction = value; } }

    public AdeLaunch(Transaction transaction, CustomScriptManager CustomSM, UD05Form ud05Form)
    {
        oTrans = transaction;
        Csm = CustomSM;
        Ud05Form = ud05Form;
        mainTransaction = new MainTransaction(oTrans, CustomSM, ud05Form);
    }

    public MainTransaction LaunchForm(Transaction transaction, CustomScriptManager CustomSM, UD05Form ud05Form)
    {
        oTrans = transaction;
        Csm = CustomSM;
        Ud05Form = ud05Form;
        return mainTransaction;
    }

    public void LoadForm()
    {
        //if (mainTransaction == null)
        //{
        //    mainTransaction = (MainTransaction)mainTran;
        //}
        mainTransaction.LoadForm();
    }
}

public class MainTransaction
{
    #region Attributes

    private CustomScriptManager _csm;
    private Transaction _oTrans;
    private UD05Form _Ud33Form;
    private FlowLayoutPanel flowLayoutPanel1;
    //UD33Transaction trans;
    MainViewModel mainVM = MainViewModel.GetInstance();

    #endregion

    #region Properties

    public UD05Form Ud05Form { get { return _Ud33Form; } set { _Ud33Form = value; } }

    public Transaction oTrans { get { return _oTrans; } set { _oTrans = value; } }

    public CustomScriptManager Csm { get { return _csm; } set { _csm = value; } }

    #endregion

    #region Functions

    public MainTransaction(Transaction transaction, CustomScriptManager CustomSM, UD05Form ud05Form)
    {
        Csm = CustomSM;
        oTrans = transaction;
        Ud05Form = ud05Form;
        mainVM.oTrans = oTrans;
        mainVM.InitRepository();
    }

    public void LoadForm()
    {
        Control[] ctrls = Ud05Form.Controls.Find("windowDockingArea1", true);
        ctrls[0].Visible = false;
        Control[] BarraTareas = Ud05Form.Controls.Find("_SonomaForm_Toolbars_Dock_Area_Top", true);
        BarraTareas[0].Visible = false;
        Control[] Ventana = Ud05Form.Controls.Find("windowDockingArea2", true);
        Ventana[0].Visible = false;
        //
        // Organizando el formulario
        //
        Ud05Form.ControlBox = false;
        Ud05Form.FormBorderStyle = FormBorderStyle.FixedDialog;
        Ud05Form.MaximizeBox = false;
        Ud05Form.MinimizeBox = false;
        Ud05Form.AutoScaleMode = AutoScaleMode.Dpi;
        Ud05Form.AutoScaleDimensions = new System.Drawing.SizeF(96f, 96f);
        Ud05Form.ClientSize = new System.Drawing.Size(238, 259);
        Ud05Form.StartPosition = FormStartPosition.CenterScreen;
        this.LoadFlowLayout();
    }

    private void LoadFlowLayout()
    {
        this.flowLayoutPanel1 = new System.Windows.Forms.FlowLayoutPanel();
        this.flowLayoutPanel1.AutoScroll = true;
        this.flowLayoutPanel1.Location = new System.Drawing.Point(12, 12);
        this.flowLayoutPanel1.Name = "flowLayoutPanel1";
        this.flowLayoutPanel1.Size = new System.Drawing.Size(220, 220);
        this.flowLayoutPanel1.TabIndex = 0;
        Ud05Form.Controls.Add(this.flowLayoutPanel1);
        //trans = new UD33Transaction(oTrans);
        // iniciando elementos
        if (Ud05Form.LaunchFormOptions != null && Ud05Form.LaunchFormOptions.ValueIn != null)
        {
            string str = Ud05Form.LaunchFormOptions.ValueIn.ToString();
            string[] param = str.Split(new char[] { '%' });
            mainVM.Orden = param[0];
            mainVM.Orden_Linea = param[1];
            mainVM.Embarque = param[2];
            mainVM.Embarque_Linea = param[3];
        }
        else
        {
            mainVM.Orden = "1";
            mainVM.Orden_Linea = "2";
            mainVM.Embarque = "1";
            mainVM.Embarque_Linea = "1";
        }
        string dato = "";
        dato += "Orden = " + mainVM.Orden + "\r\n";
        dato += "Orden linea = " + mainVM.Orden_Linea + "\r\n";
        dato += "embarque = " + mainVM.Embarque + "\r\n";
        dato += "embarque linea = " + mainVM.Embarque_Linea + "\r\n";
        //MessageBox.Show(dato);
        mainVM.MainForm = Ud05Form;
        populateItems();
    }

    private void populateItems()
    {
        if (flowLayoutPanel1.Controls.Count > 0)
        {
            flowLayoutPanel1.Controls.Clear();
        }
        NewListItem newListItem = new NewListItem(Ud05Form);
        newListItem.Orden = mainVM.Orden;
        newListItem.Orden_Linea = mainVM.Orden_Linea;
        newListItem.Embarque = mainVM.Embarque;
        newListItem.Embarque_Linea = mainVM.Embarque_Linea;
        flowLayoutPanel1.Controls.Add(newListItem);
        // Agregando elementos segun existencia
        mainVM.ListaCajas = mainVM.Repository.EmbalajeGetList(mainVM.Orden, mainVM.Orden_Linea, mainVM.Embarque, mainVM.Embarque_Linea);
        //mainVM.Trans = trans;
        if (mainVM.ListaCajas != null)
        {
            foreach (var item in mainVM.ListaCajas)
            {
                ListItem row = new ListItem();
                row.Title = item.Caja;
                row.Description = "Cant.: " + item.Cajas.ToString();
                row.Image = item.TipoCaja;
                row.Caja = item;
                flowLayoutPanel1.Controls.Add(row);
            }
        }
        // Ajustando variables del mainViewModel           
        mainVM.FlowLayoutPanel1 = flowLayoutPanel1;
    }

    #endregion

}


#region CustomControls

public class AdeComboButton : UserControl
{
    #region Init

    private PictureBox pictureBox1;
    private Label label1;

    private void InitializeComponent()
    {
        this.label1 = new System.Windows.Forms.Label();
        this.pictureBox1 = new System.Windows.Forms.PictureBox();
        ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
        this.SuspendLayout();
        // 
        // label1
        // 
        this.label1.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
        this.label1.Dock = System.Windows.Forms.DockStyle.Fill;
        this.label1.Location = new System.Drawing.Point(0, 0);
        this.label1.Name = "label1";
        this.label1.Size = new System.Drawing.Size(96, 25);
        this.label1.TabIndex = 2;
        this.label1.Text = "AdeComboButton";
        this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
        this.label1.Click += new System.EventHandler(this.label1_Click);
        this.label1.MouseEnter += new System.EventHandler(this.label1_MouseEnter);
        this.label1.MouseLeave += new System.EventHandler(this.label1_MouseLeave);
        // 
        // pictureBox1
        // 
        this.pictureBox1.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.pictureBox1.Dock = System.Windows.Forms.DockStyle.Right;
        this.pictureBox1.Image = Recursos.chevron_down_15px;
        this.pictureBox1.Location = new System.Drawing.Point(96, 0);
        this.pictureBox1.Name = "pictureBox1";
        this.pictureBox1.Size = new System.Drawing.Size(19, 25);
        this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.CenterImage;
        this.pictureBox1.TabIndex = 1;
        this.pictureBox1.TabStop = false;
        this.pictureBox1.Click += new System.EventHandler(this.pictureBox1_Click);
        // 
        // AdeComboButton
        // 
        this.Controls.Add(this.label1);
        this.Controls.Add(this.pictureBox1);
        this.Name = "AdeComboButton";
        this.Size = new System.Drawing.Size(115, 25);
        ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
        this.ResumeLayout(false);

    }

    #endregion

    public event EventHandler AdeClick;
    private Color BackLabelColor;

    public override string Text
    {
        get { return label1.Text; }
        set { label1.Text = value; }
    }

    public AdeComboButton()
    {
        InitializeComponent();
        BackLabelColor = label1.BackColor;
    }

    private void label1_Click(object sender, EventArgs e)
    {
        AdeClick(this, e);
    }

    private void pictureBox1_Click(object sender, EventArgs e)
    {
        AdeClick(this, e);
    }

    private void label1_MouseEnter(object sender, EventArgs e)
    {
        label1.BackColor = Functions.ChangeColorBrightness(BackLabelColor, -0.3);
    }

    private void label1_MouseLeave(object sender, EventArgs e)
    {
        label1.BackColor = BackLabelColor;
    }
}

public class AdeComboForm : Form
{
    #region Init

    private Panel Optionspanel;
    public Button btnOK;
    private Button btnCancel;
    public ListBox lbOptions;

    private void InitializeComponent()
    {
        this.Optionspanel = new System.Windows.Forms.Panel();
        this.btnOK = new System.Windows.Forms.Button();
        this.btnCancel = new System.Windows.Forms.Button();
        this.lbOptions = new System.Windows.Forms.ListBox();
        this.Optionspanel.SuspendLayout();
        this.SuspendLayout();
        // 
        // Optionspanel
        // 
        this.Optionspanel.Controls.Add(this.btnOK);
        this.Optionspanel.Controls.Add(this.btnCancel);
        this.Optionspanel.Dock = System.Windows.Forms.DockStyle.Bottom;
        this.Optionspanel.Location = new System.Drawing.Point(3, 168);
        this.Optionspanel.Name = "Optionspanel";
        this.Optionspanel.Size = new System.Drawing.Size(208, 29);
        this.Optionspanel.TabIndex = 3;
        // 
        // btnOK
        // 
        this.btnOK.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnOK.Dock = System.Windows.Forms.DockStyle.Right;
        this.btnOK.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnOK.ForeColor = System.Drawing.Color.White;
        this.btnOK.Location = new System.Drawing.Point(103, 0);
        this.btnOK.Name = "btnOK";
        this.btnOK.Size = new System.Drawing.Size(105, 29);
        this.btnOK.TabIndex = 4;
        this.btnOK.Text = "Ok";
        this.btnOK.UseVisualStyleBackColor = false;
        this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
        // 
        // btnCancel
        // 
        this.btnCancel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnCancel.Dock = System.Windows.Forms.DockStyle.Left;
        this.btnCancel.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnCancel.ForeColor = System.Drawing.Color.White;
        this.btnCancel.Location = new System.Drawing.Point(0, 0);
        this.btnCancel.Name = "btnCancel";
        this.btnCancel.Size = new System.Drawing.Size(105, 29);
        this.btnCancel.TabIndex = 3;
        this.btnCancel.Text = "Cancelar";
        this.btnCancel.UseVisualStyleBackColor = false;
        this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
        // 
        // lbOptions
        // 
        this.lbOptions.Dock = System.Windows.Forms.DockStyle.Fill;
        this.lbOptions.FormattingEnabled = true;
        this.lbOptions.Location = new System.Drawing.Point(3, 3);
        this.lbOptions.Name = "lbOptions";
        this.lbOptions.Size = new System.Drawing.Size(208, 165);
        this.lbOptions.TabIndex = 4;
        // 
        // AdeComboForm
        // 
        this.ClientSize = new System.Drawing.Size(214, 200);
        this.Controls.Add(this.lbOptions);
        this.Controls.Add(this.Optionspanel);
        this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
        this.Name = "AdeComboForm";
        this.Padding = new System.Windows.Forms.Padding(3);
        this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
        this.Load += new System.EventHandler(this.AdeComboForm_Load);
        this.Optionspanel.ResumeLayout(false);
        this.ResumeLayout(false);

    }

    #endregion

    public delegate void SelectIndexChangedHandler(int Index, Form form);
    public event SelectIndexChangedHandler SelectIndexChanged;

    public object DataSource { get { return lbOptions.DataSource; } set { lbOptions.DataSource = value; } }

    public string DisplayMember { get { return lbOptions.DisplayMember; } set { lbOptions.DisplayMember = value; } }

    public string ValueMember { get { return lbOptions.ValueMember; } set { lbOptions.ValueMember = value; } }

    public object SelectedValue { get { return lbOptions.SelectedValue; } set { lbOptions.SelectedValue = value; } }

    public int SelectedIndex { get { return lbOptions.SelectedIndex; } set { lbOptions.SelectedIndex = value; } }

    public AdeComboForm()
    {
        InitializeComponent();
    }

    private void AdeComboForm_Load(object sender, EventArgs e)
    {
    }

    private void btnCancel_Click(object sender, EventArgs e)
    {
        this.Close();
    }

    private void btnOK_Click(object sender, EventArgs e)
    {
        SelectIndexChanged(lbOptions.SelectedIndex, this);
    }
}

#endregion

#region Entities

public class EmbalajeEntity
{
    public string Id { get; set; }

    public int Orden { get; set; }

    [DisplayName("Linea de orden")]
    public int Orden_Linea { get; set; }

    [DisplayName("Embarque")]
    public int Embarque { get; set; }

    [DisplayName("Linea de embarque")]
    public int Embarque_Linea { get; set; }

    [DisplayName("Tipo de caja")]
    public string TipoCaja { get; set; }

    public string Caja { get; set; }

    public decimal Largo { get; set; }

    public decimal Ancho { get; set; }

    public decimal Alto { get; set; }

    public string UM { get; set; }

    public decimal Peso { get; set; }

    public int Cajas { get; set; }

    [DisplayName("ID empleado")]
    public string EmployeeID { get; set; }

    public string Caja01 { get; set; }

    public string Caja02 { get; set; }

    public string Caja03 { get; set; }

    public string Caja04 { get; set; }

    public int NroCaja01 { get; set; }

    public int NroCaja02 { get; set; }

    public int NroCaja03 { get; set; }

    public int NroCaja04 { get; set; }

    public EmbalajeEntity()
    {
        Id = "";
        Orden = 0;
        Orden_Linea = 0;
        Embarque = 0;
        Embarque_Linea = 0;
        TipoCaja = "";
        Caja = ""; // Asigna valor por defecto a Caja
        Largo = 0m; // Asigna valor por defecto a Largo (decimal)
        Ancho = 0m; // Asigna valor por defecto a Ancho (decimal)
        Alto = 0m; // Asigna valor por defecto a Alto (decimal)
        UM = ""; // Asigna valor por defecto a UM
        Peso = 0m; // Asigna valor por defecto a Peso (decimal)
        Cajas = 0; // Asigna valor por defecto a Cajas
        EmployeeID = ""; // Asigna valor por defecto a EmployeeID
        Caja01 = ""; // Asigna valor por defecto a Caja01
        Caja02 = ""; // Asigna valor por defecto a Caja02
        Caja03 = ""; // Asigna valor por defecto a Caja03
        Caja04 = ""; // Asigna valor por defecto a Caja04
        NroCaja01 = 0; // Asigna valor por defecto a NroCaja01
        NroCaja02 = 0; // Asigna valor por defecto a NroCaja02
        NroCaja03 = 0; // Asigna valor por defecto a NroCaja03
        NroCaja04 = 0; // Asigna valor por defecto a NroCaja04
    }
}

#endregion

#region Helpers

public class Functions
{
    public static void AssignDataBinding(Control control, BindingSource binding, string propiedad)
    {
        if (control is Ice.Lib.Framework.EpiNumericEditor)
        {
            control.DataBindings.Add("Value", binding, propiedad);
        }
        if (control is DateTimePicker)
        {
            control.DataBindings.Add("Value", binding, propiedad);
        }
        if (control is ComboBox)
        {
            control.DataBindings.Add("SelectedValue", binding, propiedad);
        }
        if (control is TextBox)
        {
            control.DataBindings.Add("Text", binding, propiedad);
        }
        if (control is Button)
        {
            control.DataBindings.Add("Text", binding, propiedad);
        }
        if (control is AdeComboButton)
        {
            control.DataBindings.Add("Text", binding, propiedad);
        }
    }

    public static void AssignDataCombos(ComboBox combo, object datasource, string DisplayMember, string Valuemember)
    {
        combo.DataSource = datasource;
        combo.DisplayMember = DisplayMember;
        combo.ValueMember = Valuemember;
    }

    public static void AssignDataCombos(EpiUltraCombo combo, object datasource, string DisplayMember, string Valuemember)
    {
        combo.DataSource = datasource;
        combo.DisplayMember = DisplayMember;
        combo.ValueMember = Valuemember;
        combo.SetColumnFilter(new string[] { DisplayMember });
    }

    public static Color ChangeColorBrightness(Color color, double correctionFactor)
    {
        double red = color.R;
        double green = color.G;
        double blue = color.B;

        if (correctionFactor < 0)
        {
            correctionFactor = 1 + correctionFactor;
            red *= correctionFactor;
            green *= correctionFactor;
            blue *= correctionFactor;
        }
        else
        {
            red = (255 - red) * correctionFactor + red;
            green = (255 - green) * correctionFactor + green;
            blue = (255 - blue) * correctionFactor + blue;
        }
        return Color.FromArgb(color.A, (byte)red, (byte)green, (byte)blue);
    }
}

public class MainRepository
{
    UD33Impl boUD33;
    EpiTransaction oTrans;

    public MainRepository(EpiTransaction trans)
    {
        this.oTrans = trans;
        boUD33 = WCFServiceSupport.CreateImpl<UD33Impl>(oTrans.CoreSession, UD33Impl.UriPath);
    }

    public List<EmbalajeEntity> EmbalajeGetList(string Orden, string Orden_Linea, string Embarque, string Embarque_linea)
    {
        UD33DataSet dsUD33 = new UD33DataSet();
        List<EmbalajeEntity> lista = new List<EmbalajeEntity>();
        bool morePages = false;
        dsUD33 = boUD33.GetRows("ShortChar01 = '" + Orden + "' and ShortChar02 = '" + Orden_Linea + "' and ShortChar03 = '" + Embarque + "' and ShortChar04 = '" + Embarque_linea + "'", "", 0, 1, out morePages);
        if (dsUD33.UD33.Rows.Count <= 0)
        {
            return new List<EmbalajeEntity>();
        }
        foreach (DataRow item in dsUD33.UD33.Rows)
        {
            EmbalajeEntity cajas = UD33ToEmbalajeEntity(item);
            lista.Add(cajas);
        }
        return lista;
    }

    private EmbalajeEntity UD33ToEmbalajeEntity(DataRow item)
    {
        EmbalajeEntity cajas = new EmbalajeEntity();
        cajas.Alto = (decimal)item["Number01"];
        cajas.Ancho = (decimal)item["Number02"];
        cajas.Caja = item["Character01"].ToString();
        cajas.Cajas = decimal.ToInt32((decimal)item["Number03"]);
        cajas.Embarque = int.Parse(item["ShortChar03"].ToString());
        cajas.Embarque_Linea = int.Parse(item["ShortChar04"].ToString());
        cajas.Id = item["Key1"].ToString();
        cajas.Largo = (decimal)item["Number04"];
        cajas.Orden = int.Parse(item["ShortChar01"].ToString());
        cajas.Orden_Linea = int.Parse(item["ShortChar02"].ToString());
        cajas.Peso = (decimal)item["Number05"];
        cajas.TipoCaja = item["ShortChar05"].ToString();
        cajas.UM = item["ShortChar06"].ToString();
        cajas.EmployeeID = item["ShortChar07"].ToString();
        //Nuevos campos
        cajas.NroCaja01 = decimal.ToInt32((decimal)item["Number11"]);
        cajas.NroCaja02 = decimal.ToInt32((decimal)item["Number12"]);
        cajas.NroCaja03 = decimal.ToInt32((decimal)item["Number13"]);
        cajas.NroCaja04 = decimal.ToInt32((decimal)item["Number14"]);
        cajas.Caja01 = item["ShortChar11"].ToString();
        cajas.Caja02 = item["ShortChar12"].ToString();
        cajas.Caja03 = item["ShortChar13"].ToString();
        cajas.Caja04 = item["ShortChar14"].ToString();
        return cajas;
    }

    public EmbalajeEntity Get_Create()
    {
        string ID = Guid.NewGuid().ToString();
        EmbalajeEntity entity = new EmbalajeEntity();
        entity.Id = ID;
        return entity;
    }

    public EmbalajeEntity EmbalajeCreate(EmbalajeEntity entity)
    {
		
        UD33DataSet dsUD33 = new UD33DataSet();
        boUD33.GetaNewUD33(dsUD33);
        // boUD33.GetNewUD33(dsUD33, entity.Id, "", "", "");
        foreach (DataRow item in dsUD33.UD33.Rows)
        {
			/*try{
			if (entity.PesoBruto == 0)
		    {
		        throw new ArgumentException("Peso Bruto no puede ser 0.");
		    }
			if (entity.Cajas == 0)
		    {
		        throw new ArgumentException("Cantidad de Cajas no puede ser 0.");
		    }
			if (entity.TipoCaja == "")
		    {
		        throw new ArgumentException("Debes seleccionar un Tipo de Caja.");
		    }
			}catch(Exception ex){
				throw new ArgumentException("Error: " + ex.ToString());
		    }*/
            // Identificadores
            item["Key1"] = entity.Id;
            item["ShortChar01"] = entity.Orden.ToString();
            item["ShortChar02"] = entity.Orden_Linea.ToString();
            item["ShortChar03"] = entity.Embarque.ToString();
            item["ShortChar04"] = entity.Embarque_Linea.ToString();
            // Datos
            item["Number01"] = entity.Alto;
            item["Number02"] = entity.Ancho;
            item["Number03"] = entity.Cajas;
            item["Character01"] = entity.Caja;
            item["Number04"] = entity.Largo;
            item["Number05"] = entity.Peso;
            item["ShortChar05"] = entity.TipoCaja;
            item["ShortChar06"] = entity.UM;
            item["ShortChar07"] = entity.EmployeeID;
            // nuevas cajas
            item["Number11"] = entity.NroCaja01;
            item["Number12"] = entity.NroCaja02;
            item["Number13"] = entity.NroCaja03;
            item["Number14"] = entity.NroCaja04;
            item["ShortChar11"] = entity.Caja01;
            item["ShortChar12"] = entity.Caja02;
            item["ShortChar13"] = entity.Caja03;
            item["ShortChar14"] = entity.Caja04;
        }
        boUD33.Update(dsUD33);
        dsUD33.Dispose();
        return entity;
    }

    public EmbalajeEntity EmbalajeGetByID(string Id)
    {
        EmbalajeEntity entity = null;
        var ud33Caja = boUD33.GetByID(Id, "", "", "", "");
        if (ud33Caja.UD33.Rows.Count <= 0)
        {
            return null;
        }
        foreach (DataRow item in ud33Caja.UD33.Rows)
        {
            entity = UD33ToEmbalajeEntity(item);
        }
        return entity;
    }

    public EmbalajeEntity EmbalajeUpdate(EmbalajeEntity entity)
    {
        var ud33Caja = boUD33.GetByID(entity.Id, "", "", "", "");
        if (ud33Caja.UD33.Rows.Count <= 0)
        {
            System.Windows.Forms.MessageBox.Show("Registro no encontrado, no es posible actualizar");
            return entity;
        }
        string data = "";
        data += "Orden = " + entity.Orden.ToString() + "\r\n";
        data += "Orden_Linea = " + entity.Orden_Linea.ToString() + "\r\n";
        data += "Embarque = " + entity.Embarque.ToString() + "\r\n";
        data += "Embarque_Linea = " + entity.Embarque_Linea.ToString() + "\r\n";
        data += "Alto = " + entity.Alto.ToString() + "\r\n";
        data += "Ancho = " + entity.Ancho.ToString() + "\r\n";
        data += "Cajas = " + entity.Cajas.ToString() + "\r\n";
        data += "Caja = " + entity.Caja.ToString() + "\r\n";
        data += "Largo = " + entity.Largo.ToString() + "\r\n";
        data += "Peso = " + entity.Peso.ToString() + "\r\n";
        data += "TipoCaja = " + entity.TipoCaja.ToString() + "\r\n";
        data += "UM = " + entity.UM.ToString() + "\r\n";
        data += "EmployeeId = " + entity.EmployeeID.ToString() + "\r\n";
        data += "NroCaja01 = " + entity.NroCaja01.ToString() + "\r\n";
        data += "NroCaja02 = " + entity.NroCaja02.ToString() + "\r\n";
        data += "NroCaja03 = " + entity.NroCaja03.ToString() + "\r\n";
        data += "NroCaja04 = " + entity.NroCaja04.ToString() + "\r\n";
        data += "Caja01 = " + entity.Caja01.ToString() + "\r\n";
        data += "Caja02 = " + entity.Caja02.ToString() + "\r\n";
        data += "Caja03 = " + entity.Caja03.ToString() + "\r\n";
        data += "Caja04 = " + entity.Caja04.ToString() + "\r\n";
        //MessageBox.Show(data);

        foreach (DataRow item in ud33Caja.UD33.Rows)
        {
            // Identificadores
            item["ShortChar01"] = entity.Orden.ToString();
            item["ShortChar02"] = entity.Orden_Linea.ToString();
            item["ShortChar03"] = entity.Embarque.ToString();
            item["ShortChar04"] = entity.Embarque_Linea.ToString();
            // Datos
            item["Number01"] = entity.Alto;
            item["Number02"] = entity.Ancho;
            item["Number03"] = entity.Cajas;
            item["Character01"] = entity.Caja;
            item["Number04"] = entity.Largo;
            item["Number05"] = entity.Peso;
            item["ShortChar05"] = entity.TipoCaja;
            item["ShortChar06"] = entity.UM;
            item["ShortChar07"] = entity.EmployeeID;
            // nuevas cajas
            item["Number11"] = entity.NroCaja01;
            item["Number12"] = entity.NroCaja02;
            item["Number13"] = entity.NroCaja03;
            item["Number14"] = entity.NroCaja04;
            item["ShortChar11"] = entity.Caja01;
            item["ShortChar12"] = entity.Caja02;
            item["ShortChar13"] = entity.Caja03;
            item["ShortChar14"] = entity.Caja04;
        }
        boUD33.Update(ud33Caja);
        System.Windows.Forms.MessageBox.Show("Registro Actualizado!");
        return entity;
    }

    public EmbalajeEntity EmbalajeDelete(EmbalajeEntity entity)
    {
        var ud33Caja = boUD33.GetByID(entity.Id, "", "", "", "");
        if (ud33Caja.UD33.Rows.Count <= 0)
        {
            System.Windows.Forms.MessageBox.Show("Registro no encontrado, no es posible eliminar");
            return null;
        }
        var fila = ud33Caja.UD33.Rows[0];
        boUD33.DeleteByID(entity.Id, "", "", "", "");
        System.Windows.Forms.MessageBox.Show("Registro eliminado");
        return entity;
    }

    public List<PackingEntity> LoadComboCajas()
    {
        List<PackingEntity> ListaTipoCajas = new List<PackingEntity>();
        PackingImpl boPacking = WCFServiceSupport.CreateImpl<PackingImpl>(oTrans.CoreSession, PackingImpl.UriPath);
        bool morePages = false;
        var dsPacking = boPacking.GetList("", 0, 1, out morePages);
        if (dsPacking == null || dsPacking.PackingList == null)
        {
            return null;
        }
        foreach (DataRow item in dsPacking.PackingList.Rows)
        {
            PackingEntity row = new PackingEntity();
            row.Id = item["PkgCode"].ToString();
            row.Description = item["Description"].ToString();
            row.PkgHeight = (decimal)item["PkgHeight"];
            row.PkgLength = (decimal)item["PkgLength"];
            row.PkgSizeUOM = item["PkgSizeUOM"].ToString();
            row.PkgWidth = (decimal)item["PkgWidth"];
            ListaTipoCajas.Add(row);
        }
        return ListaTipoCajas;
    }
}

#endregion

#region Models

public class CajasEntity
{
    public string Id { get; set; }

    public int Orden { get; set; }

    public int Orden_Linea { get; set; }

    public int Embarque { get; set; }

    public int Embarque_Linea { get; set; }

    public string TipoCaja { get; set; }

    public string Caja { get; set; }

    public decimal Largo { get; set; }

    public decimal Ancho { get; set; }

    public decimal Alto { get; set; }

    public string UM { get; set; }

    public decimal Peso { get; set; }

    public int Cajas { get; set; }

    public string EmployeeID { get; set; }

    public CajasEntity()
    {
        Id = ""; // Valor por defecto para string
        Orden = 0; // Valor por defecto para int
        Orden_Linea = 0;
        Embarque = 0;
        Embarque_Linea = 0;
        TipoCaja = "";
        Caja = "";
        Largo = 0m; // Valor por defecto para decimal
        Ancho = 0m;
        Alto = 0m;
        UM = "";
        Peso = 0m;
        Cajas = 0;
        EmployeeID = "";
    }
}

public class PackingEntity
{
    public string Id { get; set; }

    public string Description { get; set; }

    public decimal PkgLength { get; set; }

    public decimal PkgWidth { get; set; }

    public decimal PkgHeight { get; set; }

    public string PkgSizeUOM { get; set; }

    public PackingEntity()
    {
        Id = "";           // Valor por defecto para string
        Description = "";  // Valor por defecto para string
        PkgLength = 0m;    // Valor por defecto para decimal
        PkgWidth = 0m;     // Valor por defecto para decimal
        PkgHeight = 0m;    // Valor por defecto para decimal
        PkgSizeUOM = "";   // Valor por defecto para string 
    }
}

#endregion

#region Resources

public class Recursos
{
    public static Bitmap chevron_down_20px
    {
        get
        {
            Bitmap bitmap = new Bitmap(new MemoryStream(Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEJSURBVDhP7ZM7TgJRGIUvGrgzdrTQWtmDFi7B1i3QEnbgJrBiBZaS0Jl5Udm5A+2obCmAHM/lnkycByhGOr7kFPOfRzKZjDnxPyAKb5GF13o8GPZv3IYeeYhb90jsCknwAJgznX/EZbedxK7dhs75IKRnZKYtaycug9hO896eQSC174ibPdkVkDb7zH0UOnsHvZZ8nYEiObwPvVfKFwbT1hWPi0rIa4yZsVul9rHGd1q4Dc158BJ2acxLQSl49arz2JlfdDRTBE/mXF9tUyrViRlm2VF9N8jsHcOfNSMSPWYU/x2I7CXLb9Ux3ugpdhiITMCBybexibvJ/hv8Gxr8uiMnnU4cFWO+AEuXMdP/YhSxAAAAAElFTkSuQmCC")));
            return bitmap;
        }
    }
    public static Bitmap chevron_down_15px
    {
        get
        {
            Bitmap bitmap = new Bitmap(new MemoryStream(Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADvSURBVDhP1Y5LjgFRFIYrRGJqAUiwCJoVmEmZINoiLEXPW2JWCRswqNRzVBvwHLCAnvekfKf6VAeRYMaf/Ln3/I9zr/HmCMPww/f9SRzHGZUuIDr+VxAEDZX+gNjyPO/IuYTf1wu0OFX/4LpuMzEoFRB+2GhGUZTjPof/C86Kc/HJdSUvvXRBB2HP12uWZWW5zwhZtm3n5ZRZdPG5b2E7KaZA6MMNLOkPFnAH0xfL4vNQTyuXwBwQWjuOU5QCwbEuKonO2dfobRAyCe0oVnSuyix6ErgHikMKK1iXU2a1HgOlEfyl+KnSc0i//mowjBOH1teIGpQlMQAAAABJRU5ErkJggg==")));
            return bitmap;
        }
    }
}

#endregion

#region ViewModels

public class BaseViewModel : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
    {
        //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        if(PropertyChanged != null)
            PropertyChanged.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    protected void SetValue<T>(ref T backingField, T value, [CallerMemberName] string propertyName = null)
    {
        if (EqualityComparer<T>.Default.Equals(backingField, value))
        {
            return;
        }

        backingField = value;
        OnPropertyChanged(propertyName);
    }
}

public class CajasCreateViewModel : BaseViewModel
{
    private int _OrderNum = 0;
    private int _OrderLine = 0;
    private int _PackNum = 0;
    private int _PackLine = 0;
    private string _BoxId = "";
    private string _Caja = "";
    private decimal _Largo = 0;
    private decimal _Alto = 0;
    private decimal _Ancho = 0;
    private string _UM = "";
    private decimal _Peso = 0;
    private int _Cajas = 0;
    private string _EmployeeID = "";
    // Nuevos valores
    private string _Caja01 = "";
    private string _Caja02 = "";
    private string _Caja03 = "";
    private string _Caja04 = "";
    private string _Caja01Desc = "Seleccione caja...";
    private string _Caja02Desc = "Seleccione caja...";
    private string _Caja03Desc = "Seleccione caja...";
    private string _Caja04Desc = "Seleccione caja...";
    private int _NroCaja01 = 0;
    private int _NroCaja02 = 0;
    private int _NroCaja03 = 0;
    private int _NroCaja04 = 0;
    private Form _MainForm;
    private List<PackingEntity> _ListaCajas = new List<PackingEntity>();
    private int _PalletOption = 0;

    public int OrderNum { get { return _OrderNum; } set { SetValue(ref _OrderNum, value); } }

    public int OrderLine { get { return _OrderLine; } set { SetValue(ref _OrderLine, value); } }

    public int PackNum { get { return _PackNum; } set { SetValue(ref _PackNum, value); } }

    public int PackLine { get { return _PackLine; } set { SetValue(ref _PackLine, value); } }

    public string BoxId { get { return _BoxId; } set { SetValue(ref _BoxId, value); } }

    public string Caja { get { return _Caja; } set { SetValue(ref _Caja, value); } }

    public decimal Largo { get { return _Largo; } set { SetValue(ref _Largo, value); } }

    public decimal Alto { get { return _Alto; } set { SetValue(ref _Alto, value); } }

    public decimal Ancho { get { return _Ancho; } set { SetValue(ref _Ancho, value); } }

    public string UM { get { return _UM; } set { SetValue(ref _UM, value); } }

    public decimal Peso { get { return _Peso; } set { SetValue(ref _Peso, value); } }

    public int Cajas { get { return _Cajas; } set { SetValue(ref _Cajas, value); } }

    public string EmployeeID { get { return _EmployeeID; } set { SetValue(ref _EmployeeID, value); } }

    public string Caja01 { get { return _Caja01; } set { SetValue(ref _Caja01, value); } }

    public string Caja02 { get { return _Caja02; } set { SetValue(ref _Caja02, value); } }

    public string Caja03 { get { return _Caja03; } set { SetValue(ref _Caja03, value); } }

    public string Caja04 { get { return _Caja04; } set { SetValue(ref _Caja04, value); } }

    public string Caja01Desc { get { return _Caja01Desc; } set { SetValue(ref _Caja01Desc, value); } }

    public string Caja02Desc { get { return _Caja02Desc; } set { SetValue(ref _Caja02Desc, value); } }

    public string Caja03Desc { get { return _Caja03Desc; } set { SetValue(ref _Caja03Desc, value); } }

    public string Caja04Desc { get { return _Caja04Desc; } set { SetValue(ref _Caja04Desc, value); } }

    public int NroCaja01 { get { return _NroCaja01; } set { SetValue(ref _NroCaja01, value); } }

    public int NroCaja02 { get { return _NroCaja02; } set { SetValue(ref _NroCaja02, value); } }

    public int NroCaja03 { get { return _NroCaja03; } set { SetValue(ref _NroCaja03, value); } }

    public int NroCaja04 { get { return _NroCaja04; } set { SetValue(ref _NroCaja04, value); } }

    public Form MainForm { get { return _MainForm; } set { SetValue(ref _MainForm, value); } }

    public List<PackingEntity> ListaCajas { get { return _ListaCajas; } set { SetValue(ref _ListaCajas, value); } }

    public int PalletOption { get { return _PalletOption; } set { SetValue(ref _PalletOption, value); } }

    #region Functions

    public CajasCreateViewModel()
    {
        var MainVM = MainViewModel.GetInstance();
        PackingEntity packingNinguno = new PackingEntity()
        {
            Id = "",
            Description = "Ninguno"
        };
        var lista = MainVM.Repository.LoadComboCajas();
        ListaCajas.Clear();
        ListaCajas.Add(packingNinguno);
        foreach (var item in lista)
        {
            ListaCajas.Add(item);
        }
    }

    public void onClickSave()
    {
        var MainVM = MainViewModel.GetInstance();
        try
        {
            var newData = saveDataAsync();
            MainVM.CurrentEmbalaje = newData;
            MainVM.AddNewCaja(newData);
            //MainVM.EmbalajeVM.GetList();
            MainVM.LoadCajasControl();
            MainForm.Close();
        }
        catch
        {
            throw;
        }

    }

    private EmbalajeEntity saveDataAsync()
    {
        var MainVM = MainViewModel.GetInstance();
        EmbalajeEntity request = new EmbalajeEntity()
        {
            Alto = Alto,
            Ancho = Ancho,
            Caja = Caja,
            Cajas = Cajas,
            Embarque = PackNum,
            Embarque_Linea = PackLine,
            EmployeeID = EmployeeID,
            Id = Guid.NewGuid().ToString(),
            Largo = Largo,
            Orden = OrderNum,
            Orden_Linea = OrderLine,
            Peso = Peso,
            TipoCaja = BoxId,
            UM = UM,
            Caja01 = Caja01,
            Caja02 = Caja02,
            Caja03 = Caja03,
            Caja04 = Caja04,
            NroCaja01 = NroCaja01,
            NroCaja02 = NroCaja02,
            NroCaja03 = NroCaja03,
            NroCaja04 = NroCaja04
        };
        request.EmployeeID = MainVM.oTrans.CoreSession.UserID;
        var response = MainVM.Repository.EmbalajeCreate(request);
        return response;
    }

    public List<PackingEntity> GetComboCajas()
    {
        var lista = ListaCajas;
        return lista;
    }

    private void OpenPalletOptions(int option)
    {
        PalletOption = option;
        AdeComboForm form = new AdeComboForm();
        // asignando valores
        var list = GetComboCajas();
        form.DataSource = list;
        form.DisplayMember = "Description";
        form.ValueMember = "Id";
        switch (PalletOption)
        {
            case 1:
                form.SelectedValue = Caja01;
                break;
            case 2:
                form.SelectedValue = Caja02;
                break;
            case 3:
                form.SelectedValue = Caja03;
                break;
            case 4:
                form.SelectedValue = Caja04;
                break;
            default:
                break;
        }
        form.SelectIndexChanged += Form_SelectIndexChanged;
        form.ShowDialog();
    }

    private void Form_SelectIndexChanged(int Index, Form form)
    {
        if (Index != -1)
        {
            var list = GetComboCajas();
            var box = list[Index];
            switch (PalletOption)
            {
                case 1:
                    Caja01 = box.Id;
                    Caja01Desc = box.Description;
                    break;
                case 2:
                    Caja02 = box.Id;
                    Caja02Desc = box.Description;
                    break;
                case 3:
                    Caja03 = box.Id;
                    Caja03Desc = box.Description;
                    break;
                case 4:
                    Caja04 = box.Id;
                    Caja04Desc = box.Description;
                    break;
                default:
                    break;
            }
            form.Close();
        }
        else
        {
            MessageBox.Show("Debe seleccionar una opcion");
        }
    }

    public void PalletBox01()
    {
        OpenPalletOptions(1);
    }

    public void PalletBox02()
    {
        OpenPalletOptions(2);
    }

    public void PalletBox03()
    {
        OpenPalletOptions(3);
    }

    public void PalletBox04()
    {
        OpenPalletOptions(4);
    }

    public void OpenBoxOption()
    {
        AdeComboForm BoxOptionForm = new AdeComboForm();
        // asignando valores
        var list = GetComboCajas();
        BoxOptionForm.DataSource = list;
        BoxOptionForm.DisplayMember = "Description";
        BoxOptionForm.ValueMember = "Id";
        BoxOptionForm.SelectedValue = BoxId;
        BoxOptionForm.SelectIndexChanged += BoxOptionForm_SelectIndexChanged;
        BoxOptionForm.ShowDialog();
    }

    private void BoxOptionForm_SelectIndexChanged(int Index, Form form)
    {
        if (Index == -1)
        {
            MessageBox.Show("Debe seleccionar una opci�n");
            return;
        }
        var list = GetComboCajas();
        var box = list[Index];
        BoxId = box.Id;
        Caja = box.Description;
        // asignando valores de otras cajas
        Alto = box.PkgHeight;
        Ancho = box.PkgWidth;
        Largo = box.PkgLength;
        UM = box.PkgSizeUOM;
        form.Close();
    }

    #endregion
}

public class CajasEditViewModel : BaseViewModel
{
    #region Attributes

    private int _Orden = 0;
    private int _Orden_Linea = 0;
    private int _Embarque = 0;
    private int _Embarque_Linea = 0;
    private string _TipoCaja = "";
    private string _Caja = "";
    private decimal _Largo = 0;
    private decimal _Ancho = 0;
    private decimal _Alto = 0;
    private string _UM = "";
    private decimal _Peso = 0;
    private int _Cajas = 0;
    private string _EmployeeID = "";
    // Nuevos valores
    private string _Caja01 = "";
    private string _Caja02 = "";
    private string _Caja03 = "";
    private string _Caja04 = "";
    private string _Caja01Desc = "Seleccione caja...";
    private string _Caja02Desc = "Seleccione caja...";
    private string _Caja03Desc = "Seleccione caja...";
    private string _Caja04Desc = "Seleccione caja...";
    private int _NroCaja01 = 0;
    private int _NroCaja02 = 0;
    private int _NroCaja03 = 0;
    private int _NroCaja04 = 0;
    private Form _MainForm;
    private EmbalajeEntity _Model = new EmbalajeEntity();
    private List<PackingEntity> _ListaCajas = new List<PackingEntity>();
    private int _PalletOption = 0;

    #endregion

    #region Properties

    public Form MainForm { get { return _MainForm; } set { SetValue(ref _MainForm, value); } }

    public int Orden { get { return _Orden; } set { SetValue(ref _Orden, value); } }

    public int Orden_Linea { get { return _Orden_Linea; } set { SetValue(ref _Orden_Linea, value); } }

    public int Embarque { get { return _Embarque; } set { SetValue(ref _Embarque, value); } }

    public int Embarque_Linea { get { return _Embarque_Linea; } set { SetValue(ref _Embarque_Linea, value); } }

    public string TipoCaja { get { return _TipoCaja; } set { SetValue(ref _TipoCaja, value); } }

    public string Caja { get { return _Caja; } set { SetValue(ref _Caja, value); } }// descripcion de la caja

    public decimal Largo { get { return _Largo; } set { SetValue(ref _Largo, value); } }

    public decimal Ancho { get { return _Ancho; } set { SetValue(ref _Ancho, value); } }

    public decimal Alto { get { return _Alto; } set { SetValue(ref _Alto, value); } }

    public string UM { get { return _UM; } set { SetValue(ref _UM, value); } }

    public decimal Peso { get { return _Peso; } set { SetValue(ref _Peso, value); } }

    public int Cajas { get { return _Cajas; } set { SetValue(ref _Cajas, value); } }

    public string EmployeeID { get { return _EmployeeID; } set { SetValue(ref _EmployeeID, value); } }

    public string Caja01 { get { return _Caja01; } set { SetValue(ref _Caja01, value); } }

    public string Caja02 { get { return _Caja02; } set { SetValue(ref _Caja02, value); } }

    public string Caja03 { get { return _Caja03; } set { SetValue(ref _Caja03, value); } }

    public string Caja04 { get { return _Caja04; } set { SetValue(ref _Caja04, value); } }

    public string Caja01Desc { get { return _Caja01Desc; } set { SetValue(ref _Caja01Desc, value); } }

    public string Caja02Desc { get { return _Caja02Desc; } set { SetValue(ref _Caja02Desc, value); } }

    public string Caja03Desc { get { return _Caja03Desc; } set { SetValue(ref _Caja03Desc, value); } }

    public string Caja04Desc { get { return _Caja04Desc; } set { SetValue(ref _Caja04Desc, value); } }

    public int NroCaja01 { get { return _NroCaja01; } set { SetValue(ref _NroCaja01, value); } }

    public int NroCaja02 { get { return _NroCaja02; } set { SetValue(ref _NroCaja02, value); } }

    public int NroCaja03 { get { return _NroCaja03; } set { SetValue(ref _NroCaja03, value); } }

    public int NroCaja04 { get { return _NroCaja04; } set { SetValue(ref _NroCaja04, value); } }

    public List<PackingEntity> ListaCajas { get { return _ListaCajas; } set { SetValue(ref _ListaCajas, value); } }

    public EmbalajeEntity Model
    {
        get { return _Model; }
        set
        {
            SetValue(ref _Model, value);
            Orden = _Model.Orden;
            Orden_Linea = _Model.Orden_Linea;
            Embarque = _Model.Embarque;
            Embarque_Linea = _Model.Embarque_Linea;
            TipoCaja = _Model.TipoCaja;
            Caja = _Model.Caja;
            Largo = _Model.Largo;
            Ancho = _Model.Ancho;
            Alto = _Model.Alto;
            UM = _Model.UM;
            Peso = _Model.Peso;
            Cajas = _Model.Cajas;
            EmployeeID = _Model.EmployeeID;
            Caja01 = _Model.Caja01;
            Caja02 = _Model.Caja02;
            Caja03 = _Model.Caja03;
            Caja04 = _Model.Caja04;
            Caja01Desc = EmbalajeDescription(Caja01);
            Caja02Desc = EmbalajeDescription(Caja02);
            Caja03Desc = EmbalajeDescription(Caja03);
            Caja04Desc = EmbalajeDescription(Caja04);
            NroCaja01 = _Model.NroCaja01;
            NroCaja02 = _Model.NroCaja02;
            NroCaja03 = _Model.NroCaja03;
            NroCaja04 = _Model.NroCaja04;
        }
    }

    public int PalletOption { get { return _PalletOption; } set { SetValue(ref _PalletOption, value); } }

    #endregion

    #region Functions

    public CajasEditViewModel()
    {
        var MainVM = MainViewModel.GetInstance();
        PackingEntity packingNinguno = new PackingEntity()
        {
            Id = "",
            Description = "Ninguno"
        };
        var lista = MainVM.Repository.LoadComboCajas();
        ListaCajas.Clear();
        ListaCajas.Add(packingNinguno);
        foreach (var item in lista)
        {
            ListaCajas.Add(item);
        }
    }

    private string EmbalajeDescription(string Id)
    {
        var lista = ListaCajas;
        if (lista.Count <= 0)
        {
            return "";
        }
        var caja = (from row in lista
                    where row.Id == Id
                    select row).FirstOrDefault();
        if (caja == null)
        {
            return "";
        }
        return caja.Description;
    }

    public void onClickSave()
    {
        var MainVM = MainViewModel.GetInstance();
        try
        {
            var newData = saveDataAsync();
            MainVM.CurrentEmbalaje = newData;
            //MainVM.EmbalajeVM.GetList();
            MainVM.LoadCajasControl();
            MainForm.Close();
        }
        catch
        {
            throw;
        }

    }

    private EmbalajeEntity saveDataAsync()
    {
        var MainVM = MainViewModel.GetInstance();
        Model.Alto = Alto;
        Model.Ancho = Ancho;
        Model.Caja = Caja;
        Model.Caja01 = Caja01;
        Model.Caja02 = Caja02;
        Model.Caja03 = Caja03;
        Model.Caja04 = Caja04;
        Model.Cajas = Cajas;
        Model.Embarque = Embarque;
        Model.Embarque_Linea = Embarque_Linea;
        Model.EmployeeID = EmployeeID;
        Model.Largo = Largo;
        Model.NroCaja01 = NroCaja01;
        Model.NroCaja02 = NroCaja02;
        Model.NroCaja03 = NroCaja03;
        Model.NroCaja04 = NroCaja04;
        Model.Orden = Orden;
        Model.Orden_Linea = Orden_Linea;
        Model.Peso = Peso;
        Model.TipoCaja = TipoCaja;
        Model.UM = UM;

        string data = "";
        data += "Orden = " + Model.Orden.ToString() + "\r\n";
        data += "Orden_Linea = " + Model.Orden_Linea.ToString() + "\r\n";
        data += "Embarque = " + Model.Embarque.ToString() + "\r\n";
        data += "Embarque_Linea = " + Model.Embarque_Linea.ToString() + "\r\n";
        data += "Alto = " + Model.Alto.ToString() + "\r\n";
        data += "Ancho = " + Model.Ancho.ToString() + "\r\n";
        data += "Cajas = " + Model.Cajas.ToString() + "\r\n";
        data += "Caja = " + Model.Caja.ToString() + "\r\n";
        data += "Largo = " + Model.Largo.ToString() + "\r\n";
        data += "Peso = " + Model.Peso.ToString() + "\r\n";
        data += "TipoCaja = " + Model.TipoCaja.ToString() + "\r\n";
        data += "UM = " + Model.UM.ToString() + "\r\n";
        data += "EmployeeId = " + Model.EmployeeID.ToString() + "\r\n";
        data += "NroCaja01 = " + Model.NroCaja01.ToString() + "\r\n";
        data += "NroCaja02 = " + Model.NroCaja02.ToString() + "\r\n";
        data += "NroCaja03 = " + Model.NroCaja03.ToString() + "\r\n";
        data += "NroCaja04 = " + Model.NroCaja04.ToString() + "\r\n";
        data += "Caja01 = " + Model.Caja01.ToString() + "\r\n";
        data += "Caja02 = " + Model.Caja02.ToString() + "\r\n";
        data += "Caja03 = " + Model.Caja03.ToString() + "\r\n";
        data += "Caja04 = " + Model.Caja04.ToString() + "\r\n";
        //MessageBox.Show(data);
        var response = MainVM.Repository.EmbalajeUpdate(Model);
        return response;
    }

    public List<PackingEntity> GetComboCajasIndepend()
    {
        var lista = ListaCajas;
        return lista;
    }

    public void DeleteCaja()
    {
        var MainVM = MainViewModel.GetInstance();
        MainVM.Repository.EmbalajeDelete(Model);
        // Recargando el listado de cajas
        MainVM.LoadCajasControl();
        MainForm.Close();
    }

    public void OpenBoxOption()
    {
        AdeComboForm BoxOptionForm = new AdeComboForm();
        // asignando valores
        var list = GetComboCajasIndepend();
        BoxOptionForm.DataSource = list;
        BoxOptionForm.DisplayMember = "Description";
        BoxOptionForm.ValueMember = "Id";
        BoxOptionForm.SelectedValue = TipoCaja;
        BoxOptionForm.SelectIndexChanged += BoxOptionForm_SelectIndexChanged;
        BoxOptionForm.ShowDialog();
    }

    private void BoxOptionForm_SelectIndexChanged(int Index, Form form)
    {
        if (Index == -1)
        {
            MessageBox.Show("Debe seleccionar una opci�n");
            return;
        }
        var list = GetComboCajasIndepend();
        var box = list[Index];
        TipoCaja = box.Id;
        Caja = box.Description;
        // asignando valores de otras cajas
        Alto = box.PkgHeight;
        Ancho = box.PkgWidth;
        Largo = box.PkgLength;
        UM = box.PkgSizeUOM;
        form.Close();
    }

    private void OpenPalletOptions(int option)
    {
        this.PalletOption = option;
        AdeComboForm form = new AdeComboForm();
        // asignando valores
        var list = GetComboCajasIndepend();
        form.DataSource = list;
        form.DisplayMember = "Description";
        form.ValueMember = "Id";
        switch (PalletOption)
        {
            case 1:
                form.SelectedValue = Caja01;
                break;
            case 2:
                form.SelectedValue = Caja02;
                break;
            case 3:
                form.SelectedValue = Caja03;
                break;
            case 4:
                form.SelectedValue = Caja04;
                break;
            default:
                break;
        }
        form.SelectIndexChanged += Form_SelectIndexChanged;
        form.ShowDialog();
    }

    private void Form_SelectIndexChanged(int Index, Form form)
    {
        if (Index != -1)
        {
            var list = GetComboCajasIndepend();
            var box = list[Index];
            switch (PalletOption)
            {
                case 1:
                    Caja01 = box.Id;
                    Caja01Desc = box.Description;
                    break;
                case 2:
                    Caja02 = box.Id;
                    Caja02Desc = box.Description;
                    break;
                case 3:
                    Caja03 = box.Id;
                    Caja03Desc = box.Description;
                    break;
                case 4:
                    Caja04 = box.Id;
                    Caja04Desc = box.Description;
                    break;
                default:
                    break;
            }
            form.Close();
        }
        else
        {
            MessageBox.Show("Debe seleccionar una opcion");
        }
    }

    public void PalletBox01()
    {
        OpenPalletOptions(1);
    }

    public void PalletBox02()
    {
        OpenPalletOptions(2);
    }

    public void PalletBox03()
    {
        OpenPalletOptions(3);
    }

    public void PalletBox04()
    {
        OpenPalletOptions(4);
    }

    #endregion
}

public class MainViewModel : BaseViewModel
{
    #region Singleton
    private static MainViewModel Instance;
    public static MainViewModel GetInstance()
    {
        if (Instance == null)
            Instance = new MainViewModel();
        return Instance;
    }
    #endregion

    #region Attributes

    private string _orden;
    private string _orden_Linea;
    private string _embarque;
    private string _embarque_Linea;
    private Transaction _oTrans;
    private List<EmbalajeEntity> _ListaCajas;
    private System.Windows.Forms.FlowLayoutPanel _FlowLayoutPanel1;
    private Form _mainForm;
    private bool _IsCreate = false;

    #endregion

    public List<EmbalajeEntity> ListaCajas
    {
        get { return this._ListaCajas; }
        set
        {
            this.SetValue(ref this._ListaCajas, value);
        }
    }

    public System.Windows.Forms.FlowLayoutPanel FlowLayoutPanel1
    {
        get { return this._FlowLayoutPanel1; }
        set
        {
            this.SetValue(ref this._FlowLayoutPanel1, value);
        }
    }

    public string Orden
    {
        get { return this._orden; }
        set { this.SetValue(ref this._orden, value); }
    }

    public string Orden_Linea
    {
        get { return  this._orden_Linea; }
        set { this.SetValue(ref this._orden_Linea, value); }
    }

    public string Embarque
    {
        get { return this._embarque; }
        set { this.SetValue(ref this._embarque, value); }
    }

    public string Embarque_Linea
    {
        get { return this._embarque_Linea; }
        set { this.SetValue(ref this._embarque_Linea, value); }
    }

    public Form MainForm
    {
        get { return this._mainForm; }
        set { this.SetValue(ref this._mainForm, value); }
    }

    public PalletViewModel PalletVM { get; set; }

    public CajasCreateViewModel CajasCreateVM { get; set; }

    public CajasEditViewModel CajasEditVM { get; set; }

    public EmbalajeEntity CurrentEmbalaje { get; set; }

    public MainRepository Repository { get; set; }

    public Transaction oTrans { get { return _oTrans; } set { _oTrans = value; } }

    public bool IsCreate { get { return _IsCreate; } set { _IsCreate = value; } }

    public MainViewModel()
    {
        Instance = this;
    }

    public void AddNewCaja(EmbalajeEntity caja)
    {
        this.ListaCajas.Add(caja);
        // Agregando nuevo control
        ListItem row = new ListItem();
        row.Title = caja.Caja;
        row.Description = "Cant. :" + caja.Cajas.ToString();
        row.Image = caja.TipoCaja;
        row.Caja = caja;
        FlowLayoutPanel1.Controls.Add(row);
    }

    public void UpdateCaja(EmbalajeEntity caja)
    {
        // Organizando listado de cajas
        foreach (var item in ListaCajas)
        {
            if (item.Id == caja.Id)
            {
                item.Alto = caja.Alto;
                item.Ancho = caja.Ancho;
                item.Caja = caja.Caja;
                item.Cajas = caja.Cajas;
                item.Largo = caja.Largo;
                item.Peso = caja.Peso;
                item.TipoCaja = caja.TipoCaja;
                item.UM = caja.UM;
                break;
            }
        }
        // Organizando controles de cajas
        foreach (var item in FlowLayoutPanel1.Controls)
        {
            if (item is ListItem)
            {
                ListItem Item = (ListItem)item;
                if (Item.Caja.Id == caja.Id)
                {
                    Item.Title = caja.Caja;
                    Item.Description = "Cant. :" + caja.Cajas.ToString();
                    Item.Image = caja.TipoCaja;
                    Item.Caja = caja;
                    break;
                }
            }
        }
    }

    public void LoadCajasControl()
    {
        if (FlowLayoutPanel1.Controls.Count > 0)
        {
            FlowLayoutPanel1.Controls.Clear();
        }
        NewListItem newListItem = new NewListItem(MainForm);
        newListItem.Orden = Orden;
        newListItem.Orden_Linea = Orden_Linea;
        newListItem.Embarque = Embarque;
        newListItem.Embarque_Linea = Embarque_Linea;
        FlowLayoutPanel1.Controls.Add(newListItem);
        // Agregando elementos segun existencia
        //ListaCajas = Trans.Get_Index(Orden, Orden_Linea, Embarque, Embarque_Linea);
        ListaCajas = Repository.EmbalajeGetList(Orden, Orden_Linea, Embarque, Embarque_Linea);
        if (ListaCajas != null)
        {
            foreach (var item in ListaCajas)
            {
                ListItem row = new ListItem();
                row.Title = item.Caja;
                row.Description = "Cant. :" + item.Cajas.ToString();
                row.Image = item.TipoCaja;
                row.Caja = item;
                FlowLayoutPanel1.Controls.Add(row);
            }
        }
    }

    public void InitRepository()
    {
        Repository = new MainRepository(oTrans);
    }

    public void CreateOptionOn()
    {
        IsCreate = true;
    }

    public void CreateOptionOff()
    {
        IsCreate = false;
    }

}

public class PalletViewModel : BaseViewModel
{
    private string _DescriptionBox01 = "";
    private string _DescriptionBox02 = "";
    private string _DescriptionBox03 = "";
    private string _DescriptionBox04 = "";
    private Form _MainForm;

    public string DescriptionBox01 
    {
        get { return _DescriptionBox01; }
        set { SetValue(ref _DescriptionBox01, value); }
    }

    public string DescriptionBox02 
    {
        get { return _DescriptionBox02; }
        set { SetValue(ref _DescriptionBox02, value); }
    }

    public string DescriptionBox03 
    {
        get { return _DescriptionBox03; }
        set { SetValue(ref _DescriptionBox03, value); }
    }

    public string DescriptionBox04 
    {
        get { return _DescriptionBox04; }
        set { SetValue(ref _DescriptionBox04, value); }
    }

    public Form MainForm 
    {
        get { return _MainForm; }
        set { SetValue(ref _MainForm, value); }
    }
}

#endregion

#region Views

public class CajasCreateForm : Form
{

    #region Init

    private Label lblTipoCaja;
    private Label lblCantidad;
    private Label lblNumCajas;
    private EpiNumericEditor numNumCajas;
    private System.ComponentModel.IContainer components;
    private EpiNumericEditor numPeso;
    private Button btnGuardar;
    private Button btnClose;
    private Label lblTitulo;
    private Panel infoPanel;
    private EpiTextBox txtCajaUM;
    private EpiNumericEditor numCajaAlto;
    private EpiNumericEditor numCajasAncho;
    private EpiNumericEditor numCajaLargo;
    private Label lblCajaUND;
    private Label lblCajaAlto;
    private Label lblCajaAncho;
    private Label lblCajaLargo;
    private Panel palletPanel;
    private AdeComboButton btnCajas;
    private Button btnPallet;

    private void InitializeComponent()
    {
        this.components = new System.ComponentModel.Container();
        Infragistics.Win.Appearance appearance1 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance2 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance3 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance4 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance5 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance6 = new Infragistics.Win.Appearance();
        this.lblTitulo = new System.Windows.Forms.Label();
        this.lblTipoCaja = new System.Windows.Forms.Label();
        this.lblCantidad = new System.Windows.Forms.Label();
        this.lblNumCajas = new System.Windows.Forms.Label();
        this.numNumCajas = new Ice.Lib.Framework.EpiNumericEditor();
        this.numPeso = new Ice.Lib.Framework.EpiNumericEditor();
        this.btnGuardar = new System.Windows.Forms.Button();
        this.btnClose = new System.Windows.Forms.Button();
        this.infoPanel = new System.Windows.Forms.Panel();
        this.txtCajaUM = new Ice.Lib.Framework.EpiTextBox();
        this.numCajaAlto = new Ice.Lib.Framework.EpiNumericEditor();
        this.numCajasAncho = new Ice.Lib.Framework.EpiNumericEditor();
        this.numCajaLargo = new Ice.Lib.Framework.EpiNumericEditor();
        this.lblCajaUND = new System.Windows.Forms.Label();
        this.lblCajaAlto = new System.Windows.Forms.Label();
        this.lblCajaAncho = new System.Windows.Forms.Label();
        this.lblCajaLargo = new System.Windows.Forms.Label();
        this.palletPanel = new System.Windows.Forms.Panel();
        this.btnPallet = new System.Windows.Forms.Button();
        this.btnCajas = new AdeComboButton();
        ((System.ComponentModel.ISupportInitialize)(this.numNumCajas)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numPeso)).BeginInit();
        this.infoPanel.SuspendLayout();
        ((System.ComponentModel.ISupportInitialize)(this.txtCajaUM)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajaAlto)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajasAncho)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajaLargo)).BeginInit();
        this.palletPanel.SuspendLayout();
        this.SuspendLayout();
        // 
        // lblTitulo
        // 
        this.lblTitulo.Dock = System.Windows.Forms.DockStyle.Top;
        this.lblTitulo.Location = new System.Drawing.Point(0, 0);
        this.lblTitulo.Name = "lblTitulo";
        this.lblTitulo.Size = new System.Drawing.Size(222, 27);
        this.lblTitulo.TabIndex = 0;
        this.lblTitulo.Text = "Orden";
        this.lblTitulo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
        // 
        // lblTipoCaja
        // 
        this.lblTipoCaja.Location = new System.Drawing.Point(3, 27);
        this.lblTipoCaja.Name = "lblTipoCaja";
        this.lblTipoCaja.Size = new System.Drawing.Size(64, 28);
        this.lblTipoCaja.TabIndex = 1;
        this.lblTipoCaja.Text = "Tipo embalaje";
        this.lblTipoCaja.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
        // 
        // lblCantidad
        // 
        this.lblCantidad.Location = new System.Drawing.Point(0, 122);
        this.lblCantidad.Name = "lblCantidad";
        this.lblCantidad.Size = new System.Drawing.Size(87, 20);
        this.lblCantidad.TabIndex = 19;
        this.lblCantidad.Text = "Peso unita(kg)";
        this.lblCantidad.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
        // 
        // lblNumCajas
        // 
        this.lblNumCajas.Location = new System.Drawing.Point(0, 154);
        this.lblNumCajas.Name = "lblNumCajas";
        this.lblNumCajas.Size = new System.Drawing.Size(87, 20);
        this.lblNumCajas.TabIndex = 19;
        this.lblNumCajas.Text = "No Embalajes";
        this.lblNumCajas.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
        // 
        // numNumCajas
        // 
        this.numNumCajas.AlwaysInEditMode = true;
        appearance1.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numNumCajas.Appearance = appearance1;
        this.numNumCajas.DBColumn = null;
        this.numNumCajas.EpiGuid = "18e790b0-1e9b-4515-bc25-0987c1711782";
        this.numNumCajas.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.numNumCajas.Location = new System.Drawing.Point(91, 151);
        this.numNumCajas.MaskInput = "-nnnnnnnnnnnnn";
        this.numNumCajas.Name = "numNumCajas";
        this.numNumCajas.Nullable = true;
        this.numNumCajas.PromptChar = ' ';
        this.numNumCajas.Size = new System.Drawing.Size(117, 23);
        this.numNumCajas.TabIndex = 25;
        // 
        // numPeso
        // 
        this.numPeso.AlwaysInEditMode = true;
        appearance2.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numPeso.Appearance = appearance2;
        this.numPeso.DBColumn = null;
        this.numPeso.EpiGuid = "9e154c4f-2a3b-4b00-a88e-50cb574f5808";
        this.numPeso.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.numPeso.Location = new System.Drawing.Point(91, 122);
        this.numPeso.MaskInput = "-nnnnnnnnnnn.nn";
        this.numPeso.Name = "numPeso";
        this.numPeso.Nullable = true;
        this.numPeso.NumericType = Infragistics.Win.UltraWinEditors.NumericType.Decimal;
        this.numPeso.PromptChar = ' ';
        this.numPeso.Size = new System.Drawing.Size(117, 23);
        this.numPeso.TabIndex = 24;
        // 
        // btnGuardar
        // 
        this.btnGuardar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnGuardar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnGuardar.ForeColor = System.Drawing.Color.White;
        this.btnGuardar.Location = new System.Drawing.Point(50, 185);
        this.btnGuardar.Name = "btnGuardar";
        this.btnGuardar.Size = new System.Drawing.Size(77, 28);
        this.btnGuardar.TabIndex = 26;
        this.btnGuardar.Text = "Guardar";
        this.btnGuardar.UseVisualStyleBackColor = false;
        this.btnGuardar.Click += new System.EventHandler(this.btnGuardar_Click);
        // 
        // btnClose
        // 
        this.btnClose.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnClose.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnClose.ForeColor = System.Drawing.Color.White;
        this.btnClose.Location = new System.Drawing.Point(133, 185);
        this.btnClose.Name = "btnClose";
        this.btnClose.Size = new System.Drawing.Size(77, 28);
        this.btnClose.TabIndex = 27;
        this.btnClose.Text = "Cerrar";
        this.btnClose.UseVisualStyleBackColor = false;
        this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
        // 
        // infoPanel
        // 
        this.infoPanel.Controls.Add(this.txtCajaUM);
        this.infoPanel.Controls.Add(this.numCajaAlto);
        this.infoPanel.Controls.Add(this.numCajasAncho);
        this.infoPanel.Controls.Add(this.numCajaLargo);
        this.infoPanel.Controls.Add(this.lblCajaUND);
        this.infoPanel.Controls.Add(this.lblCajaAlto);
        this.infoPanel.Controls.Add(this.lblCajaAncho);
        this.infoPanel.Controls.Add(this.lblCajaLargo);
        this.infoPanel.Location = new System.Drawing.Point(3, 63);
        this.infoPanel.Name = "infoPanel";
        this.infoPanel.Size = new System.Drawing.Size(216, 58);
        this.infoPanel.TabIndex = 28;
        // 
        // txtCajaUM
        // 
        this.txtCajaUM.AlwaysInEditMode = true;
        appearance3.TextHAlignAsString = "Left";
        this.txtCajaUM.Appearance = appearance3;
        this.txtCajaUM.AutoSize = false;
        this.txtCajaUM.EpiGuid = "4d8d867f-fc59-4ca1-8a81-fa29bf1bd779";
        this.txtCajaUM.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.txtCajaUM.Location = new System.Drawing.Point(156, 32);
        this.txtCajaUM.Name = "txtCajaUM";
        this.txtCajaUM.Size = new System.Drawing.Size(50, 23);
        this.txtCajaUM.TabIndex = 31;
        // 
        // numCajaAlto
        // 
        this.numCajaAlto.AlwaysInEditMode = true;
        appearance4.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numCajaAlto.Appearance = appearance4;
        this.numCajaAlto.DBColumn = null;
        this.numCajaAlto.EpiGuid = "539f50e8-bb2e-4ee3-b6b2-c30ab6f692a9";
        this.numCajaAlto.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.numCajaAlto.Location = new System.Drawing.Point(52, 32);
        this.numCajaAlto.MaskInput = "-nnnnnnnnnnnnnnn";
        this.numCajaAlto.Name = "numCajaAlto";
        this.numCajaAlto.Nullable = true;
        this.numCajaAlto.PromptChar = ' ';
        this.numCajaAlto.Size = new System.Drawing.Size(50, 23);
        this.numCajaAlto.TabIndex = 30;
        // 
        // numCajasAncho
        // 
        this.numCajasAncho.AlwaysInEditMode = true;
        appearance5.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numCajasAncho.Appearance = appearance5;
        this.numCajasAncho.DBColumn = null;
        this.numCajasAncho.EpiGuid = "9def6ef0-c37d-451b-9aeb-985b2527b0ca";
        this.numCajasAncho.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.numCajasAncho.Location = new System.Drawing.Point(156, 3);
        this.numCajasAncho.MaskInput = "-nnnnnnnnnnnnnnn";
        this.numCajasAncho.Name = "numCajasAncho";
        this.numCajasAncho.Nullable = true;
        this.numCajasAncho.PromptChar = ' ';
        this.numCajasAncho.Size = new System.Drawing.Size(50, 23);
        this.numCajasAncho.TabIndex = 29;
        // 
        // numCajaLargo
        // 
        this.numCajaLargo.AlwaysInEditMode = true;
        appearance6.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numCajaLargo.Appearance = appearance6;
        this.numCajaLargo.DBColumn = null;
        this.numCajaLargo.EpiGuid = "ce4f9d4a-e2d5-4cb3-9cc9-cc58cce76116";
        this.numCajaLargo.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.numCajaLargo.Location = new System.Drawing.Point(52, 3);
        this.numCajaLargo.MaskInput = "-nnnnnnnnnnnnnnn";
        this.numCajaLargo.Name = "numCajaLargo";
        this.numCajaLargo.Nullable = true;
        this.numCajaLargo.PromptChar = ' ';
        this.numCajaLargo.Size = new System.Drawing.Size(50, 23);
        this.numCajaLargo.TabIndex = 28;
        // 
        // lblCajaUND
        // 
        this.lblCajaUND.Location = new System.Drawing.Point(122, 34);
        this.lblCajaUND.Name = "lblCajaUND";
        this.lblCajaUND.Size = new System.Drawing.Size(30, 20);
        this.lblCajaUND.TabIndex = 24;
        this.lblCajaUND.Text = "UM";
        this.lblCajaUND.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
        // 
        // lblCajaAlto
        // 
        this.lblCajaAlto.Location = new System.Drawing.Point(4, 35);
        this.lblCajaAlto.Name = "lblCajaAlto";
        this.lblCajaAlto.Size = new System.Drawing.Size(44, 20);
        this.lblCajaAlto.TabIndex = 25;
        this.lblCajaAlto.Text = "Alto";
        this.lblCajaAlto.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
        // 
        // lblCajaAncho
        // 
        this.lblCajaAncho.Location = new System.Drawing.Point(108, 3);
        this.lblCajaAncho.Name = "lblCajaAncho";
        this.lblCajaAncho.Size = new System.Drawing.Size(44, 20);
        this.lblCajaAncho.TabIndex = 26;
        this.lblCajaAncho.Text = "Ancho";
        this.lblCajaAncho.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
        // 
        // lblCajaLargo
        // 
        this.lblCajaLargo.Location = new System.Drawing.Point(4, 3);
        this.lblCajaLargo.Name = "lblCajaLargo";
        this.lblCajaLargo.Size = new System.Drawing.Size(44, 20);
        this.lblCajaLargo.TabIndex = 27;
        this.lblCajaLargo.Text = "Largo";
        this.lblCajaLargo.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
        // 
        // palletPanel
        // 
        this.palletPanel.Controls.Add(this.btnPallet);
        this.palletPanel.Location = new System.Drawing.Point(3, 219);
        this.palletPanel.Name = "palletPanel";
        this.palletPanel.Size = new System.Drawing.Size(216, 58);
        this.palletPanel.TabIndex = 29;
        // 
        // btnPallet
        // 
        this.btnPallet.Location = new System.Drawing.Point(31, 15);
        this.btnPallet.Name = "btnPallet";
        this.btnPallet.Size = new System.Drawing.Size(136, 28);
        this.btnPallet.TabIndex = 0;
        this.btnPallet.Text = "Editar cajas de pallet";
        this.btnPallet.UseVisualStyleBackColor = true;
        this.btnPallet.Click += new System.EventHandler(this.btnPallet_Click);
        // 
        // btnCajas
        // 
        this.btnCajas.Location = new System.Drawing.Point(73, 30);
        this.btnCajas.Name = "btnCajas";
        this.btnCajas.Size = new System.Drawing.Size(137, 25);
        this.btnCajas.TabIndex = 30;
        this.btnCajas.AdeClick += new System.EventHandler(this.btnCajas_AdeClick);
        // 
        // CajasCreateForm
        // 
        this.ClientSize = new System.Drawing.Size(222, 220);
        this.ControlBox = false;
        this.Controls.Add(this.btnCajas);
        this.Controls.Add(this.palletPanel);
        this.Controls.Add(this.infoPanel);
        this.Controls.Add(this.btnClose);
        this.Controls.Add(this.btnGuardar);
        this.Controls.Add(this.numNumCajas);
        this.Controls.Add(this.numPeso);
        this.Controls.Add(this.lblNumCajas);
        this.Controls.Add(this.lblCantidad);
        this.Controls.Add(this.lblTipoCaja);
        this.Controls.Add(this.lblTitulo);
        this.MaximizeBox = false;
        this.MinimizeBox = false;
        this.Name = "CajasCreateForm";
        this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
        this.Text = "Agregar embalaje";
        this.Load += new System.EventHandler(this.CajasForm_Load);
        ((System.ComponentModel.ISupportInitialize)(this.numNumCajas)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numPeso)).EndInit();
        this.infoPanel.ResumeLayout(false);
        this.infoPanel.PerformLayout();
        ((System.ComponentModel.ISupportInitialize)(this.txtCajaUM)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajaAlto)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajasAncho)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajaLargo)).EndInit();
        this.palletPanel.ResumeLayout(false);
        this.ResumeLayout(false);
        this.PerformLayout();

    }

    #endregion

    MainViewModel mainVM;
    BindingSource binding;

    public CajasCreateForm()
    {
        InitializeComponent();
        mainVM = MainViewModel.GetInstance();
        mainVM.CajasCreateVM = new CajasCreateViewModel();
        mainVM.CajasCreateVM.MainForm = this;
        mainVM.CreateOptionOn();
        mainVM.CajasCreateVM.OrderNum = int.Parse(mainVM.Orden);
        mainVM.CajasCreateVM.OrderLine = int.Parse(mainVM.Orden_Linea);
        mainVM.CajasCreateVM.PackNum = int.Parse(mainVM.Embarque);
        mainVM.CajasCreateVM.PackLine = int.Parse(mainVM.Embarque_Linea);
        binding = new BindingSource();
        binding.DataSource = mainVM.CajasCreateVM;
        InitializeDataBindings();
    }

    private void InitializeDataBindings()
    {
        Functions.AssignDataBinding(btnCajas, binding, "Caja");
        Functions.AssignDataBinding(numCajaLargo, binding, "Largo");
        Functions.AssignDataBinding(numCajaAlto, binding, "Alto");
        Functions.AssignDataBinding(numCajasAncho, binding, "Ancho");
        Functions.AssignDataBinding(txtCajaUM, binding, "UM");
        Functions.AssignDataBinding(numPeso, binding, "Peso");
        Functions.AssignDataBinding(numNumCajas, binding, "Cajas");
    }

    private void btnClose_Click(object sender, EventArgs e)
    {
        this.Close();
    }

    private void CajasForm_Load(object sender, EventArgs e)
    {
        //Functions.AssignDataCombos(cboCajas, mainVM.CajasCreateVM.GetComboCajas(), "Description", "Id");
        mainVM.CajasCreateVM.EmployeeID = mainVM.oTrans.CoreSession.EmployeeID;
        lblTitulo.Text = "Orden " + mainVM.Orden + " Linea " + mainVM.Orden_Linea + " Embarque " + mainVM.Embarque + " Linea " + mainVM.Embarque_Linea;
        // Modo solo lectura
        this.numCajaLargo.ReadOnly = false;
        this.numCajasAncho.ReadOnly = false;
        this.numCajaAlto.ReadOnly = false;
        this.txtCajaUM.ReadOnly = false;
    }

    private void btnGuardar_Click(object sender, EventArgs e)
    {
        mainVM.CajasCreateVM.onClickSave();
    }

    private void cboCajas_ValueChanged(object sender, EventArgs e)
    {
        EpiUltraCombo cmb = (EpiUltraCombo)sender;
        var Idcaja = cmb.Value.ToString();
        var caja = SearchPacking(Idcaja);
        if (caja == null)
        {
            return;
        }
        mainVM.CajasCreateVM.BoxId = caja.Id;
        mainVM.CajasCreateVM.Alto = caja.PkgHeight;
        mainVM.CajasCreateVM.Ancho = caja.PkgWidth;
        mainVM.CajasCreateVM.Caja = caja.Description;
        mainVM.CajasCreateVM.Largo = caja.PkgLength;
        mainVM.CajasCreateVM.UM = caja.PkgSizeUOM;
        //condition
        if (caja.Id == "PALLET")
        {
            infoPanel.Visible = false;
            palletPanel.Visible = true;
            palletPanel.Location = new System.Drawing.Point(3, 63);
        }
        else
        {
            infoPanel.Visible = true;
            palletPanel.Visible = false;
        }
    }

    private void btnPallet_Click(object sender, EventArgs e)
    {
        PalletCreateForm form = new PalletCreateForm();
        form.ShowDialog();
    }

    private PackingEntity SearchPacking(string Id)
    {
        var lista = mainVM.CajasCreateVM.ListaCajas;
        var packing = (from row in lista
                       where row.Id == Id
                       select row).FirstOrDefault();
        return packing;
    }

    private void btnCajas_AdeClick(object sender, EventArgs e)
    {
        mainVM.CajasCreateVM.OpenBoxOption();
        //condition
        if (mainVM.CajasCreateVM.BoxId.Contains("PALLET"))
        {
            infoPanel.Visible = false;
            palletPanel.Visible = true;
            palletPanel.Location = new System.Drawing.Point(3, 63);
        }
        else
        {
            infoPanel.Visible = true;
            palletPanel.Visible = false;
        }
    }
}

public class CajasEditForm : Form
{

    #region Init

    private EpiLabel lblTipoCaja;
    private System.ComponentModel.IContainer components;
    private EpiLabel lblCantidad;
    private EpiNumericEditor numPeso;
    private EpiNumericEditor numNumCajas;
    private EpiLabel lblNumCajas;
    private EpiButton btnGuardar;
    private EpiButton btnClose;
    private EpiLabel lblTitulo;
    private Panel infoPanel;
    private EpiLabel lblCajaUND;
    private EpiTextBox txtCajaUM;
    private EpiLabel lblCajaAlto;
    private EpiNumericEditor numCajaAlto;
    private EpiNumericEditor numCajasAncho;
    private EpiLabel lblCajaAncho;
    private EpiNumericEditor numCajaLargo;
    private EpiLabel lblCajaLargo;
    private Panel palletPanel;
    private Button btnPallet;
    private AdeComboButton btnCajas;
    private EpiButton btnDelete;

    private void InitializeComponent()
    {
        this.components = new System.ComponentModel.Container();
        Infragistics.Win.Appearance appearance15 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance16 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance17 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance18 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance4 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance5 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance19 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance8 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance20 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance21 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance10 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance11 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance22 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance13 = new Infragistics.Win.Appearance();
        this.lblTitulo = new Ice.Lib.Framework.EpiLabel();
        this.lblTipoCaja = new Ice.Lib.Framework.EpiLabel();
        this.lblCantidad = new Ice.Lib.Framework.EpiLabel();
        this.numPeso = new Ice.Lib.Framework.EpiNumericEditor();
        this.numNumCajas = new Ice.Lib.Framework.EpiNumericEditor();
        this.lblNumCajas = new Ice.Lib.Framework.EpiLabel();
        this.btnGuardar = new Ice.Lib.Framework.EpiButton();
        this.btnClose = new Ice.Lib.Framework.EpiButton();
        this.btnDelete = new Ice.Lib.Framework.EpiButton();
        this.infoPanel = new System.Windows.Forms.Panel();
        this.lblCajaUND = new Ice.Lib.Framework.EpiLabel();
        this.txtCajaUM = new Ice.Lib.Framework.EpiTextBox();
        this.lblCajaAlto = new Ice.Lib.Framework.EpiLabel();
        this.numCajaAlto = new Ice.Lib.Framework.EpiNumericEditor();
        this.numCajasAncho = new Ice.Lib.Framework.EpiNumericEditor();
        this.lblCajaAncho = new Ice.Lib.Framework.EpiLabel();
        this.numCajaLargo = new Ice.Lib.Framework.EpiNumericEditor();
        this.lblCajaLargo = new Ice.Lib.Framework.EpiLabel();
        this.palletPanel = new System.Windows.Forms.Panel();
        this.btnPallet = new System.Windows.Forms.Button();
        this.btnCajas = new AdeComboButton();
        ((System.ComponentModel.ISupportInitialize)(this.numPeso)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numNumCajas)).BeginInit();
        this.infoPanel.SuspendLayout();
        ((System.ComponentModel.ISupportInitialize)(this.txtCajaUM)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajaAlto)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajasAncho)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajaLargo)).BeginInit();
        this.palletPanel.SuspendLayout();
        this.SuspendLayout();
        // 
        // lblTitulo
        // 
        appearance15.TextHAlignAsString = "Center";
        appearance15.TextVAlignAsString = "Middle";
        this.lblTitulo.Appearance = appearance15;
        this.lblTitulo.Dock = System.Windows.Forms.DockStyle.Top;
        this.lblTitulo.EpiGuid = "f568d879-ee16-447d-9fc0-894b93778ccd";
        this.lblTitulo.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.lblTitulo.Location = new System.Drawing.Point(0, 0);
        this.lblTitulo.Name = "lblTitulo";
        this.lblTitulo.Size = new System.Drawing.Size(222, 27);
        this.lblTitulo.TabIndex = 15;
        this.lblTitulo.Text = "Orden";
        // 
        // lblTipoCaja
        // 
        appearance16.TextHAlignAsString = "Right";
        appearance16.TextVAlignAsString = "Middle";
        this.lblTipoCaja.Appearance = appearance16;
        this.lblTipoCaja.EpiGuid = "ed41ad43-6342-46db-bdf4-53171d1f5e8d";
        this.lblTipoCaja.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.lblTipoCaja.Location = new System.Drawing.Point(3, 30);
        this.lblTipoCaja.Name = "lblTipoCaja";
        this.lblTipoCaja.Size = new System.Drawing.Size(73, 25);
        this.lblTipoCaja.TabIndex = 14;
        this.lblTipoCaja.Text = "Tipo embalaje";
        // 
        // lblCantidad
        // 
        appearance17.TextHAlignAsString = "Right";
        appearance17.TextVAlignAsString = "Middle";
        this.lblCantidad.Appearance = appearance17;
        this.lblCantidad.EpiGuid = "1122c03c-966f-4010-853b-3f0de83fd2fd";
        this.lblCantidad.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.lblCantidad.Location = new System.Drawing.Point(0, 122);
        this.lblCantidad.Name = "lblCantidad";
        this.lblCantidad.Size = new System.Drawing.Size(87, 20);
        this.lblCantidad.TabIndex = 5;
        this.lblCantidad.Text = "Peso unita(kg)";
        // 
        // numPeso
        // 
        this.numPeso.AlwaysInEditMode = true;
        appearance18.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numPeso.Appearance = appearance18;
        this.numPeso.DBColumn = null;
        this.numPeso.EpiGuid = "9e154c4f-2a3b-4b00-a88e-50cb574f5808";
        this.numPeso.Location = new System.Drawing.Point(93, 122);
        this.numPeso.MaskInput = "-nnnnnnnnnnn.nn";
        this.numPeso.Name = "numPeso";
        this.numPeso.Nullable = true;
        this.numPeso.NumericType = Infragistics.Win.UltraWinEditors.NumericType.Decimal;
        this.numPeso.PromptChar = ' ';
        this.numPeso.Size = new System.Drawing.Size(117, 21);
        this.numPeso.TabIndex = 4;
        // 
        // numNumCajas
        // 
        this.numNumCajas.AlwaysInEditMode = true;
        appearance4.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numNumCajas.Appearance = appearance4;
        this.numNumCajas.DBColumn = null;
        this.numNumCajas.EpiGuid = "18e790b0-1e9b-4515-bc25-0987c1711782";
        this.numNumCajas.Location = new System.Drawing.Point(93, 151);
        this.numNumCajas.MaskInput = "-nnnnnnnnnnnnn";
        this.numNumCajas.Name = "numNumCajas";
        this.numNumCajas.Nullable = true;
        this.numNumCajas.PromptChar = ' ';
        this.numNumCajas.Size = new System.Drawing.Size(117, 21);
        this.numNumCajas.TabIndex = 3;
        // 
        // lblNumCajas
        // 
        appearance5.TextHAlignAsString = "Right";
        appearance5.TextVAlignAsString = "Middle";
        this.lblNumCajas.Appearance = appearance5;
        this.lblNumCajas.EpiGuid = "408e6f43-0414-4998-a292-912f696c1bca";
        this.lblNumCajas.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.lblNumCajas.Location = new System.Drawing.Point(0, 154);
        this.lblNumCajas.Name = "lblNumCajas";
        this.lblNumCajas.Size = new System.Drawing.Size(87, 20);
        this.lblNumCajas.TabIndex = 2;
        this.lblNumCajas.Text = "No embalajes";
        // 
        // btnGuardar
        // 
        this.btnGuardar.EpiGuid = "b105b3d6-a350-4efc-a0cb-bad8283b1fbc";
        this.btnGuardar.Location = new System.Drawing.Point(82, 185);
        this.btnGuardar.Name = "btnGuardar";
        this.btnGuardar.Size = new System.Drawing.Size(66, 28);
        this.btnGuardar.TabIndex = 1;
        this.btnGuardar.Text = "Guardar";
        this.btnGuardar.Click += new System.EventHandler(this.BtnGuardar_Click);
        // 
        // btnClose
        // 
        this.btnClose.EpiGuid = "10afc5db-4cd2-41c3-9d5a-bcb327bec4ee";
        this.btnClose.Location = new System.Drawing.Point(154, 185);
        this.btnClose.Name = "btnClose";
        this.btnClose.Size = new System.Drawing.Size(56, 28);
        this.btnClose.TabIndex = 0;
        this.btnClose.Text = "Cerrar";
        this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
        // 
        // btnDelete
        // 
        this.btnDelete.EpiGuid = "250c0f40-f613-43b8-b7e3-45627e5ece3a";
        this.btnDelete.Location = new System.Drawing.Point(10, 185);
        this.btnDelete.Name = "btnDelete";
        this.btnDelete.Size = new System.Drawing.Size(66, 28);
        this.btnDelete.TabIndex = 17;
        this.btnDelete.Text = "Eliminar";
        this.btnDelete.Click += new System.EventHandler(this.btnDelete_Click);
        // 
        // infoPanel
        // 
        this.infoPanel.Controls.Add(this.lblCajaUND);
        this.infoPanel.Controls.Add(this.txtCajaUM);
        this.infoPanel.Controls.Add(this.lblCajaAlto);
        this.infoPanel.Controls.Add(this.numCajaAlto);
        this.infoPanel.Controls.Add(this.numCajasAncho);
        this.infoPanel.Controls.Add(this.lblCajaAncho);
        this.infoPanel.Controls.Add(this.numCajaLargo);
        this.infoPanel.Controls.Add(this.lblCajaLargo);
        this.infoPanel.Location = new System.Drawing.Point(3, 63);
        this.infoPanel.Name = "infoPanel";
        this.infoPanel.Size = new System.Drawing.Size(216, 58);
        this.infoPanel.TabIndex = 18;
        // 
        // lblCajaUND
        // 
        appearance19.TextHAlignAsString = "Right";
        appearance19.TextVAlignAsString = "Middle";
        this.lblCajaUND.Appearance = appearance19;
        this.lblCajaUND.EpiGuid = "f5337ef1-78b3-43ab-b6da-0a4c60bae4e6";
        this.lblCajaUND.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.lblCajaUND.Location = new System.Drawing.Point(124, 34);
        this.lblCajaUND.Name = "lblCajaUND";
        this.lblCajaUND.Size = new System.Drawing.Size(30, 20);
        this.lblCajaUND.TabIndex = 14;
        this.lblCajaUND.Text = "UM";
        // 
        // txtCajaUM
        // 
        this.txtCajaUM.AlwaysInEditMode = true;
        appearance8.TextHAlignAsString = "Left";
        this.txtCajaUM.Appearance = appearance8;
        this.txtCajaUM.AutoSize = false;
        this.txtCajaUM.EpiGuid = "4d8d867f-fc59-4ca1-8a81-fa29bf1bd779";
        this.txtCajaUM.Location = new System.Drawing.Point(160, 32);
        this.txtCajaUM.Name = "txtCajaUM";
        this.txtCajaUM.Size = new System.Drawing.Size(50, 23);
        this.txtCajaUM.TabIndex = 15;
        // 
        // lblCajaAlto
        // 
        appearance20.TextHAlignAsString = "Right";
        appearance20.TextVAlignAsString = "Middle";
        this.lblCajaAlto.Appearance = appearance20;
        this.lblCajaAlto.EpiGuid = "7ebbf991-2150-4694-a425-c85780b7cf3d";
        this.lblCajaAlto.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.lblCajaAlto.Location = new System.Drawing.Point(6, 35);
        this.lblCajaAlto.Name = "lblCajaAlto";
        this.lblCajaAlto.Size = new System.Drawing.Size(44, 20);
        this.lblCajaAlto.TabIndex = 16;
        this.lblCajaAlto.Text = "Alto";
        // 
        // numCajaAlto
        // 
        this.numCajaAlto.AlwaysInEditMode = true;
        appearance21.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numCajaAlto.Appearance = appearance21;
        this.numCajaAlto.DBColumn = null;
        this.numCajaAlto.EpiGuid = "539f50e8-bb2e-4ee3-b6b2-c30ab6f692a9";
        this.numCajaAlto.Location = new System.Drawing.Point(56, 32);
        this.numCajaAlto.MaskInput = "-nnnnnnnnnnnnnnn";
        this.numCajaAlto.Name = "numCajaAlto";
        this.numCajaAlto.Nullable = true;
        this.numCajaAlto.PromptChar = ' ';
        this.numCajaAlto.Size = new System.Drawing.Size(50, 21);
        this.numCajaAlto.TabIndex = 17;
        // 
        // numCajasAncho
        // 
        this.numCajasAncho.AlwaysInEditMode = true;
        appearance10.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numCajasAncho.Appearance = appearance10;
        this.numCajasAncho.DBColumn = null;
        this.numCajasAncho.EpiGuid = "9def6ef0-c37d-451b-9aeb-985b2527b0ca";
        this.numCajasAncho.Location = new System.Drawing.Point(160, 3);
        this.numCajasAncho.MaskInput = "-nnnnnnnnnnnnnnn";
        this.numCajasAncho.Name = "numCajasAncho";
        this.numCajasAncho.Nullable = true;
        this.numCajasAncho.PromptChar = ' ';
        this.numCajasAncho.Size = new System.Drawing.Size(50, 21);
        this.numCajasAncho.TabIndex = 18;
        // 
        // lblCajaAncho
        // 
        appearance11.TextHAlignAsString = "Right";
        appearance11.TextVAlignAsString = "Middle";
        this.lblCajaAncho.Appearance = appearance11;
        this.lblCajaAncho.EpiGuid = "746f4f9a-838f-4489-8242-4557771023fa";
        this.lblCajaAncho.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.lblCajaAncho.Location = new System.Drawing.Point(110, 3);
        this.lblCajaAncho.Name = "lblCajaAncho";
        this.lblCajaAncho.Size = new System.Drawing.Size(44, 20);
        this.lblCajaAncho.TabIndex = 19;
        this.lblCajaAncho.Text = "Ancho";
        // 
        // numCajaLargo
        // 
        this.numCajaLargo.AlwaysInEditMode = true;
        appearance22.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numCajaLargo.Appearance = appearance22;
        this.numCajaLargo.DBColumn = null;
        this.numCajaLargo.EpiGuid = "ce4f9d4a-e2d5-4cb3-9cc9-cc58cce76116";
        this.numCajaLargo.Location = new System.Drawing.Point(56, 3);
        this.numCajaLargo.MaskInput = "-nnnnnnnnnnnnnnn";
        this.numCajaLargo.Name = "numCajaLargo";
        this.numCajaLargo.Nullable = true;
        this.numCajaLargo.PromptChar = ' ';
        this.numCajaLargo.Size = new System.Drawing.Size(50, 21);
        this.numCajaLargo.TabIndex = 20;
        // 
        // lblCajaLargo
        // 
        appearance13.TextHAlignAsString = "Right";
        appearance13.TextVAlignAsString = "Middle";
        this.lblCajaLargo.Appearance = appearance13;
        this.lblCajaLargo.EpiGuid = "9d4e8670-5506-4e6a-b463-f4acda65266c";
        this.lblCajaLargo.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F);
        this.lblCajaLargo.Location = new System.Drawing.Point(6, 3);
        this.lblCajaLargo.Name = "lblCajaLargo";
        this.lblCajaLargo.Size = new System.Drawing.Size(44, 20);
        this.lblCajaLargo.TabIndex = 21;
        this.lblCajaLargo.Text = "Largo";
        // 
        // palletPanel
        // 
        this.palletPanel.Controls.Add(this.btnPallet);
        this.palletPanel.Location = new System.Drawing.Point(3, 219);
        this.palletPanel.Name = "palletPanel";
        this.palletPanel.Size = new System.Drawing.Size(216, 58);
        this.palletPanel.TabIndex = 30;
        // 
        // btnPallet
        // 
        this.btnPallet.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnPallet.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnPallet.ForeColor = System.Drawing.Color.White;
        this.btnPallet.Location = new System.Drawing.Point(31, 15);
        this.btnPallet.Name = "btnPallet";
        this.btnPallet.Size = new System.Drawing.Size(136, 28);
        this.btnPallet.TabIndex = 0;
        this.btnPallet.Text = "Editar cajas de pallet";
        this.btnPallet.UseVisualStyleBackColor = false;
        this.btnPallet.Click += new System.EventHandler(this.btnPallet_Click);
        // 
        // btnCajas
        // 
        this.btnCajas.Location = new System.Drawing.Point(82, 30);
        this.btnCajas.Name = "btnCajas";
        this.btnCajas.Size = new System.Drawing.Size(131, 25);
        this.btnCajas.TabIndex = 31;
        this.btnCajas.AdeClick += new System.EventHandler(this.btnCajas_AdeClick);
        // 
        // CajasEditForm
        // 
        this.ClientSize = new System.Drawing.Size(222, 220);
        this.ControlBox = false;
        this.Controls.Add(this.btnCajas);
        this.Controls.Add(this.palletPanel);
        this.Controls.Add(this.infoPanel);
        this.Controls.Add(this.btnDelete);
        this.Controls.Add(this.btnClose);
        this.Controls.Add(this.btnGuardar);
        this.Controls.Add(this.lblNumCajas);
        this.Controls.Add(this.numNumCajas);
        this.Controls.Add(this.numPeso);
        this.Controls.Add(this.lblCantidad);
        this.Controls.Add(this.lblTipoCaja);
        this.Controls.Add(this.lblTitulo);
        this.MaximizeBox = false;
        this.MinimizeBox = false;
        this.Name = "CajasEditForm";
        this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
        this.Text = "Editar cargue de embalaje";
        this.Load += new System.EventHandler(this.CajasForm_Load);
        ((System.ComponentModel.ISupportInitialize)(this.numPeso)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numNumCajas)).EndInit();
        this.infoPanel.ResumeLayout(false);
        this.infoPanel.PerformLayout();
        ((System.ComponentModel.ISupportInitialize)(this.txtCajaUM)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajaAlto)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajasAncho)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numCajaLargo)).EndInit();
        this.palletPanel.ResumeLayout(false);
        this.ResumeLayout(false);
        this.PerformLayout();

    }

    #endregion

    MainViewModel mainVM;
    BindingSource binding;

    public CajasEditForm()
    {
        InitializeComponent();
        mainVM = MainViewModel.GetInstance();
        mainVM.CajasEditVM = new CajasEditViewModel();
        mainVM.CajasEditVM.MainForm = this;
        mainVM.CreateOptionOff();
        mainVM.CajasEditVM.Orden = int.Parse(mainVM.Orden);
        mainVM.CajasEditVM.Orden_Linea = int.Parse(mainVM.Orden_Linea);
        mainVM.CajasEditVM.Embarque = int.Parse(mainVM.Embarque);
        mainVM.CajasEditVM.Embarque_Linea = int.Parse(mainVM.Embarque_Linea);
        binding = new BindingSource();
        binding.DataSource = mainVM.CajasEditVM;
        InitializeDataBindings();
    }

    private void InitializeDataBindings()
    {
        Functions.AssignDataBinding(btnCajas, binding, "Caja");
        Functions.AssignDataBinding(numCajaLargo, binding, "Largo");
        Functions.AssignDataBinding(numCajaAlto, binding, "Alto");
        Functions.AssignDataBinding(numCajasAncho, binding, "Ancho");
        Functions.AssignDataBinding(txtCajaUM, binding, "UM");
        Functions.AssignDataBinding(numPeso, binding, "Peso");
        Functions.AssignDataBinding(numNumCajas, binding, "Cajas");
    }

    private void BtnGuardar_Click(object sender, EventArgs e)
    {
        mainVM.CajasEditVM.onClickSave();
    }

    private void btnClose_Click(object sender, EventArgs e)
    {
        this.Close();
    }

    private void CajasForm_Load(object sender, EventArgs e)
    {
        mainVM.CajasEditVM.EmployeeID = mainVM.oTrans.CoreSession.EmployeeID;
        this.lblTitulo.Text = "Orden " + mainVM.Orden + " Linea " + mainVM.Orden_Linea + " Embarque " + mainVM.Embarque + " Linea " + mainVM.Embarque_Linea;
        // Modo solo lectura
        this.numCajaLargo.ReadOnly = false;
        this.numCajasAncho.ReadOnly = false;
        this.numCajaAlto.ReadOnly = false;
        this.txtCajaUM.ReadOnly = false;
        // assign data
        mainVM.CajasEditVM.Model = mainVM.CurrentEmbalaje;
        // evaluate pallet
        if (mainVM.CajasEditVM.TipoCaja.Contains("PALLET"))
        {
            infoPanel.Visible = false;
            palletPanel.Visible = true;
            palletPanel.Location = new System.Drawing.Point(3, 63);
        }
        else
        {
            infoPanel.Visible = true;
            palletPanel.Visible = false;
        }
    }

    //private void cboCajas_SelectedIndexChanged(object sender, EventArgs e)
    //{
    //    try
    //    {
    //        ComboBox cmb = (ComboBox)sender;
    //        int index = cmb.SelectedIndex;
    //        var lista = mainVM.CajasEditVM.GetComboCajasIndepend();
    //        var caja = lista[index];
    //        if (caja == null)
    //        {
    //            return;
    //        }
    //        //condition
    //        if (caja.Id == "PALLET")
    //        {
    //            infoPanel.Visible = false;
    //            palletPanel.Visible = true;
    //            palletPanel.Location = new System.Drawing.Point(3, 63);
    //        }
    //        else
    //        {
    //            infoPanel.Visible = true;
    //            palletPanel.Visible = false;
    //            mainVM.CajasEditVM.TipoCaja = caja.Id;
    //            mainVM.CajasEditVM.Alto = caja.PkgHeight;
    //            mainVM.CajasEditVM.Ancho = caja.PkgWidth;
    //            mainVM.CajasEditVM.Caja = caja.Description;
    //            mainVM.CajasEditVM.Largo = caja.PkgLength;
    //            mainVM.CajasEditVM.UM = caja.PkgSizeUOM;
    //        }
    //    }
    //    catch
    //    {

    //    }
    //}

    private void btnDelete_Click(object sender, EventArgs e)
    {
        var opt = MessageBox.Show("�Est� seguro que desea eliminar este registro?", "Eliminiar registro", MessageBoxButtons.YesNo);
        if (opt == DialogResult.Yes)
        {
            mainVM.CajasEditVM.DeleteCaja();
        }
    }

    private void btnPallet_Click(object sender, EventArgs e)
    {
        PalletEditForm form = new PalletEditForm();
        form.ShowDialog();
    }

    private void btnCajas_AdeClick(object sender, EventArgs e)
    {
        mainVM.CajasEditVM.OpenBoxOption();
        //condition
        if (mainVM.CajasEditVM.TipoCaja == "PALLET")
        {
            infoPanel.Visible = false;
            palletPanel.Visible = true;
            palletPanel.Location = new System.Drawing.Point(3, 63);
        }
        else
        {
            infoPanel.Visible = true;
            palletPanel.Visible = false;
        }
    }
}

public class ListItem : UserControl
{
    /// <summary> 
    /// Variable del dise�ador necesaria.
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    /// <summary> 
    /// Limpiar los recursos que se est�n usando.
    /// </summary>
    /// <param name="disposing">true si los recursos administrados se deben desechar; false en caso contrario.</param>
    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }
        base.Dispose(disposing);
    }

    #region C�digo generado por el Dise�ador de componentes

    /// <summary> 
    /// M�todo necesario para admitir el Dise�ador. No se puede modificar
    /// el contenido de este m�todo con el editor de c�digo.
    /// </summary>
    private void InitializeComponent()
    {
        this.lblTitle = new System.Windows.Forms.Label();
        this.lblDescription = new System.Windows.Forms.Label();
        this.panel1 = new System.Windows.Forms.Panel();
        this.lblImage = new System.Windows.Forms.Label();
        this.panel1.SuspendLayout();
        this.SuspendLayout();
        // 
        // lblTitle
        // 
        this.lblTitle.AutoEllipsis = true;
        this.lblTitle.AutoSize = true;
        this.lblTitle.Location = new System.Drawing.Point(68, 3);
        this.lblTitle.Name = "lblTitle";
        this.lblTitle.Size = new System.Drawing.Size(34, 20);
        this.lblTitle.TabIndex = 1;
        this.lblTitle.Text = "C01";
        this.lblTitle.Click += new System.EventHandler(this.ListItem_Click);
        // 
        // lblDescription
        // 
        this.lblDescription.AutoEllipsis = true;
        this.lblDescription.AutoSize = true;
        this.lblDescription.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
        this.lblDescription.Location = new System.Drawing.Point(67, 23);
        this.lblDescription.Name = "lblDescription";
        this.lblDescription.Size = new System.Drawing.Size(73, 15);
        this.lblDescription.TabIndex = 2;
        this.lblDescription.Text = "Cantidad: 40";
        this.lblDescription.Click += new System.EventHandler(this.ListItem_Click);
        // 
        // panel1
        // 
        this.panel1.BackColor = System.Drawing.Color.DarkCyan;
        this.panel1.Controls.Add(this.lblImage);
        this.panel1.Location = new System.Drawing.Point(3, 3);
        this.panel1.Name = "panel1";
        this.panel1.Size = new System.Drawing.Size(58, 42);
        this.panel1.TabIndex = 3;
        // 
        // lblImage
        // 
        this.lblImage.AutoSize = true;
        this.lblImage.Font = new System.Drawing.Font("Segoe UI", 18F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
        this.lblImage.Location = new System.Drawing.Point(3, 0);
        this.lblImage.Name = "lblImage";
        this.lblImage.Size = new System.Drawing.Size(56, 32);
        this.lblImage.TabIndex = 1;
        this.lblImage.Text = "C01";
        this.lblImage.Click += new System.EventHandler(this.ListItem_Click);
        // 
        // ListItem
        // 
        this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 20F);
        this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
        this.Controls.Add(this.panel1);
        this.Controls.Add(this.lblDescription);
        this.Controls.Add(this.lblTitle);
        this.Font = new System.Drawing.Font("Segoe UI", 11F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
        this.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
        this.Name = "ListItem";
        this.Size = new System.Drawing.Size(164, 52);
        this.Click += new System.EventHandler(this.ListItem_Click);
        this.panel1.ResumeLayout(false);
        this.panel1.PerformLayout();
        this.ResumeLayout(false);
        this.PerformLayout();

    }

    #endregion
    private System.Windows.Forms.Label lblTitle;
    private System.Windows.Forms.Label lblDescription;
    private System.Windows.Forms.Panel panel1;
    private System.Windows.Forms.Label lblImage;

    public ListItem()
    {
        InitializeComponent();
    }

    #region Propiedades
    private string _title;
    private string _description;
    private string _image;
    private EmbalajeEntity _caja = new EmbalajeEntity();

    [Category("Prop Personalizada")]
    public string Title
    {
        get { return _title; }
        set
        {
            _title = value;
            lblTitle.Text = value;
        }
    }

    [Category("Prop Personalizada")]
    public string Description
    {
        get { return _description; }
        set
        {
            _description = value;
            lblDescription.Text = value;
        }
    }

    [Category("Prop Personalizada")]
    public string Image
    {
        get { return _image; }
        set
        {
            _image = value;
            lblImage.Text = value;
        }
    }

    public EmbalajeEntity Caja { get { return _caja; } set { _caja = value; } }

    #endregion

    private void ListItem_Click(object sender, EventArgs e)
    {
        var mainVM = MainViewModel.GetInstance();
        mainVM.CurrentEmbalaje = Caja;
        CajasEditForm editar = new CajasEditForm();
        editar.ShowDialog();
    }
}

public class NewListItem : UserControl
{
    private Form _Formulario;
    private EpiButton btnAdd;
    private EpiButton btnClose;

    public string Orden { get; set; }

    public string Orden_Linea { get; set; }

    public string Embarque { get; set; }

    public string Embarque_Linea { get; set; }

    public NewListItem(Form form)
    {
        InitializeComponent();
        Orden = "";
        Orden_Linea = "";
        Embarque = "";
        Embarque_Linea = "";
        this._Formulario = form;
        //this._trans = uD33Transaction;
    }

    public NewListItem(Form form, EpiTransaction trans)
    {
        InitializeComponent();
        Orden = "";
        Orden_Linea = "";
        Embarque = "";
        Embarque_Linea = "";
        this._Formulario = form;
        //this.lTrans = trans;
    }

    private void InitializeComponent()
    {
        this.btnAdd = new Ice.Lib.Framework.EpiButton();
        this.btnClose = new Ice.Lib.Framework.EpiButton();
        this.SuspendLayout();
        // 
        // btnAdd
        // 
        this.btnAdd.EpiGuid = "250c0f40-f613-43b8-b7e3-45627e5ece3a";
        this.btnAdd.Location = new System.Drawing.Point(14, 12);
        this.btnAdd.Name = "btnAdd";
        this.btnAdd.Size = new System.Drawing.Size(66, 28);
        this.btnAdd.TabIndex = 18;
        this.btnAdd.Text = "Agregar";
        this.btnAdd.Click += new System.EventHandler(this.btnAdd_Click);
        // 
        // btnClose
        // 
        this.btnClose.EpiGuid = "d22421f3-d083-4d96-9a52-03b4812b0e0a";
        this.btnClose.Location = new System.Drawing.Point(86, 12);
        this.btnClose.Name = "btnClose";
        this.btnClose.Size = new System.Drawing.Size(66, 28);
        this.btnClose.TabIndex = 19;
        this.btnClose.Text = "Cerrar";
        this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
        // 
        // NewListItem
        // 
        this.Controls.Add(this.btnClose);
        this.Controls.Add(this.btnAdd);
        this.Name = "NewListItem";
        this.Size = new System.Drawing.Size(164, 52);
        this.ResumeLayout(false);

    }

    private void btnAdd_Click(object sender, EventArgs e)
    {
        CajasCreateForm cajasForm = new CajasCreateForm();
        cajasForm.ShowDialog();
    }

    private void btnClose_Click(object sender, EventArgs e)
    {
        _Formulario.Close();
    }
}

public class PalletCreateForm : Form
{
    #region InitCode
    private System.ComponentModel.IContainer components;
    private Panel optionsPanel;
    private Button btnCancel;
    private PalletPanel palletPanel1;
    private Label lblTitulo;
    private Button btnOk;

    private void InitializeComponent()
    {
        this.optionsPanel = new System.Windows.Forms.Panel();
        this.btnOk = new System.Windows.Forms.Button();
        this.btnCancel = new System.Windows.Forms.Button();
        this.palletPanel1 = new PalletPanel();
        this.lblTitulo = new System.Windows.Forms.Label();
        this.optionsPanel.SuspendLayout();
        this.SuspendLayout();
        // 
        // optionsPanel
        // 
        this.optionsPanel.Controls.Add(this.btnOk);
        this.optionsPanel.Controls.Add(this.btnCancel);
        this.optionsPanel.Location = new System.Drawing.Point(12, 184);
        this.optionsPanel.Name = "optionsPanel";
        this.optionsPanel.Size = new System.Drawing.Size(198, 24);
        this.optionsPanel.TabIndex = 3;
        // 
        // btnOk
        // 
        this.btnOk.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnOk.Dock = System.Windows.Forms.DockStyle.Right;
        this.btnOk.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnOk.ForeColor = System.Drawing.Color.White;
        this.btnOk.Location = new System.Drawing.Point(99, 0);
        this.btnOk.Name = "btnOk";
        this.btnOk.Size = new System.Drawing.Size(99, 24);
        this.btnOk.TabIndex = 1;
        this.btnOk.Text = "Aceptar";
        this.btnOk.UseVisualStyleBackColor = false;
        this.btnOk.Click += new System.EventHandler(this.btnOk_Click);
        // 
        // btnCancel
        // 
        this.btnCancel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnCancel.Dock = System.Windows.Forms.DockStyle.Left;
        this.btnCancel.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnCancel.ForeColor = System.Drawing.Color.White;
        this.btnCancel.Location = new System.Drawing.Point(0, 0);
        this.btnCancel.Name = "btnCancel";
        this.btnCancel.Size = new System.Drawing.Size(99, 24);
        this.btnCancel.TabIndex = 0;
        this.btnCancel.Text = "Cancelar";
        this.btnCancel.UseVisualStyleBackColor = false;
        this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
        // 
        // palletPanel1
        // 
        this.palletPanel1.Location = new System.Drawing.Point(5, 30);
        this.palletPanel1.Name = "palletPanel1";
        this.palletPanel1.Size = new System.Drawing.Size(205, 120);
        this.palletPanel1.TabIndex = 4;
        // 
        // lblTitulo
        // 
        this.lblTitulo.Dock = System.Windows.Forms.DockStyle.Top;
        this.lblTitulo.Location = new System.Drawing.Point(0, 0);
        this.lblTitulo.Name = "lblTitulo";
        this.lblTitulo.Size = new System.Drawing.Size(222, 27);
        this.lblTitulo.TabIndex = 5;
        this.lblTitulo.Text = "Orden";
        this.lblTitulo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
        // 
        // PalletCreateForm
        // 
        this.ClientSize = new System.Drawing.Size(222, 220);
        this.ControlBox = false;
        this.Controls.Add(this.lblTitulo);
        this.Controls.Add(this.palletPanel1);
        this.Controls.Add(this.optionsPanel);
        this.Name = "PalletCreateForm";
        this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
        this.Text = "Cajas Pallet Crear";
        this.Load += new System.EventHandler(this.PalletCreateForm_Load);
        this.optionsPanel.ResumeLayout(false);
        this.ResumeLayout(false);

    }

    #endregion

    MainViewModel MainVM;
    BindingSource binding;

    public PalletCreateForm()
    {
        InitializeComponent();
        MainVM = MainViewModel.GetInstance();
        binding = new BindingSource();
        binding.DataSource = MainVM.CajasCreateVM;
        InitializeDataBindings();
        //eventos
        palletPanel1.btnBox01.AdeClick += BtnBox01_AdeClick;
        palletPanel1.btnBox02.AdeClick += BtnBox02_AdeClick;
        palletPanel1.btnBox03.AdeClick += BtnBox03_AdeClick;
        palletPanel1.btnBox04.AdeClick += BtnBox04_AdeClick;
    }

    private void BtnBox04_AdeClick(object sender, EventArgs e)
    {
        MainVM.CajasCreateVM.PalletBox04();
    }

    private void BtnBox03_AdeClick(object sender, EventArgs e)
    {
        MainVM.CajasCreateVM.PalletBox03();
    }

    private void BtnBox02_AdeClick(object sender, EventArgs e)
    {
        MainVM.CajasCreateVM.PalletBox02();
    }

    private void BtnBox01_AdeClick(object sender, EventArgs e)
    {
        MainVM.CajasCreateVM.PalletBox01();
    }

    private void InitializeDataBindings()
    {
        Functions.AssignDataBinding(palletPanel1.btnBox01, binding, "Caja01Desc");
        Functions.AssignDataBinding(palletPanel1.btnBox02, binding, "Caja02Desc");
        Functions.AssignDataBinding(palletPanel1.btnBox03, binding, "Caja03Desc");
        Functions.AssignDataBinding(palletPanel1.btnBox04, binding, "Caja04Desc");
        Functions.AssignDataBinding(palletPanel1.numBox01, binding, "NroCaja01");
        Functions.AssignDataBinding(palletPanel1.numBox02, binding, "NroCaja02");
        Functions.AssignDataBinding(palletPanel1.numBox03, binding, "NroCaja03");
        Functions.AssignDataBinding(palletPanel1.numBox04, binding, "NroCaja04");
    }

    private void btnCancel_Click(object sender, EventArgs e)
    {
        this.Close();
    }

    private void btnOk_Click(object sender, EventArgs e)
    {
        this.Close();
    }

    private void PalletCreateForm_Load(object sender, EventArgs e)
    {
        lblTitulo.Text = "Orden " + MainVM.Orden + " Linea " + MainVM.Orden_Linea + " Embarque " + MainVM.Embarque + " Linea " + MainVM.Embarque_Linea;
    }
}

public class PalletEditForm : Form
{
    #region InitCode
    private System.ComponentModel.IContainer components;
    private Panel optionsPanel;
    private Button btnCancel;
    private PalletPanel palletPanel1;
    private Button btnOk;

    private void InitializeComponent()
    {
        this.optionsPanel = new System.Windows.Forms.Panel();
        this.btnOk = new System.Windows.Forms.Button();
        this.btnCancel = new System.Windows.Forms.Button();
        this.palletPanel1 = new PalletPanel();
        this.optionsPanel.SuspendLayout();
        this.SuspendLayout();
        // 
        // optionsPanel
        // 
        this.optionsPanel.Controls.Add(this.btnOk);
        this.optionsPanel.Controls.Add(this.btnCancel);
        this.optionsPanel.Location = new System.Drawing.Point(12, 184);
        this.optionsPanel.Name = "optionsPanel";
        this.optionsPanel.Size = new System.Drawing.Size(198, 24);
        this.optionsPanel.TabIndex = 3;
        // 
        // btnOk
        // 
        this.btnOk.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnOk.Dock = System.Windows.Forms.DockStyle.Right;
        this.btnOk.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnOk.ForeColor = System.Drawing.Color.White;
        this.btnOk.Location = new System.Drawing.Point(99, 0);
        this.btnOk.Name = "btnOk";
        this.btnOk.Size = new System.Drawing.Size(99, 24);
        this.btnOk.TabIndex = 1;
        this.btnOk.Text = "Aceptar";
        this.btnOk.UseVisualStyleBackColor = false;
        this.btnOk.Click += new System.EventHandler(this.btnOk_Click);
        // 
        // btnCancel
        // 
        this.btnCancel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(59)))), ((int)(((byte)(91)))));
        this.btnCancel.Dock = System.Windows.Forms.DockStyle.Left;
        this.btnCancel.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
        this.btnCancel.ForeColor = System.Drawing.Color.White;
        this.btnCancel.Location = new System.Drawing.Point(0, 0);
        this.btnCancel.Name = "btnCancel";
        this.btnCancel.Size = new System.Drawing.Size(99, 24);
        this.btnCancel.TabIndex = 0;
        this.btnCancel.Text = "Cancelar";
        this.btnCancel.UseVisualStyleBackColor = false;
        this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
        // 
        // palletPanel1
        // 
        this.palletPanel1.Location = new System.Drawing.Point(5, 3);
        this.palletPanel1.Name = "palletPanel1";
        this.palletPanel1.Size = new System.Drawing.Size(205, 120);
        this.palletPanel1.TabIndex = 4;
        // 
        // PalletEditForm
        // 
        this.ClientSize = new System.Drawing.Size(222, 220);
        this.ControlBox = false;
        this.Controls.Add(this.palletPanel1);
        this.Controls.Add(this.optionsPanel);
        this.Name = "PalletEditForm";
        this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
        this.Text = "Cajas Pallet";
        this.optionsPanel.ResumeLayout(false);
        this.ResumeLayout(false);

    }

    #endregion

    MainViewModel MainVM;
    BindingSource binding;

    public PalletEditForm()
    {
        InitializeComponent();
        MainVM = MainViewModel.GetInstance();
        //MainVM.PalletVM = new PalletViewModel();
        //MainVM.PalletVM.MainForm = this;
        binding = new BindingSource();
        binding.DataSource = MainVM.CajasEditVM;
        InitializeDataBindings();
        //eventos
        palletPanel1.btnBox01.AdeClick += BtnBox01_AdeClick;
        palletPanel1.btnBox02.AdeClick += BtnBox02_AdeClick;
        palletPanel1.btnBox03.AdeClick += BtnBox03_AdeClick;
        palletPanel1.btnBox04.AdeClick += BtnBox04_AdeClick;
    }

    private void BtnBox04_AdeClick(object sender, EventArgs e)
    {
        MainVM.CajasEditVM.PalletBox04();
    }

    private void BtnBox03_AdeClick(object sender, EventArgs e)
    {
        MainVM.CajasEditVM.PalletBox03();
    }

    private void BtnBox02_AdeClick(object sender, EventArgs e)
    {
        MainVM.CajasEditVM.PalletBox02();
    }

    private void BtnBox01_AdeClick(object sender, EventArgs e)
    {
        MainVM.CajasEditVM.PalletBox01();
    }

    private void InitializeDataBindings()
    {
        Functions.AssignDataBinding(palletPanel1.btnBox01, binding, "Caja01Desc");
        Functions.AssignDataBinding(palletPanel1.btnBox02, binding, "Caja02Desc");
        Functions.AssignDataBinding(palletPanel1.btnBox03, binding, "Caja03Desc");
        Functions.AssignDataBinding(palletPanel1.btnBox04, binding, "Caja04Desc");
        Functions.AssignDataBinding(palletPanel1.numBox01, binding, "NroCaja01");
        Functions.AssignDataBinding(palletPanel1.numBox02, binding, "NroCaja02");
        Functions.AssignDataBinding(palletPanel1.numBox03, binding, "NroCaja03");
        Functions.AssignDataBinding(palletPanel1.numBox04, binding, "NroCaja04");
    }

    private void btnCancel_Click(object sender, EventArgs e)
    {
        this.Close();
    }

    private void btnOk_Click(object sender, EventArgs e)
    {
        this.Close();
    }
}

public class PalletPanel : UserControl
{
    #region Init

    public Ice.Lib.Framework.EpiNumericEditor numBox04;
    private System.ComponentModel.IContainer components;
    public Ice.Lib.Framework.EpiNumericEditor numBox03;
    public Ice.Lib.Framework.EpiNumericEditor numBox02;
    public Ice.Lib.Framework.EpiNumericEditor numBox01;
    public Label lblTitle04;
    public Label lblTitle03;
    public Label lblTitle02;
    public Label lblTitle01;
    public AdeComboButton btnBox02;
    public AdeComboButton btnBox03;
    public AdeComboButton btnBox04;
    public AdeComboButton btnBox01;

    private void InitializeComponent()
    {
        this.components = new System.ComponentModel.Container();
        Infragistics.Win.Appearance appearance1 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance2 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance3 = new Infragistics.Win.Appearance();
        Infragistics.Win.Appearance appearance4 = new Infragistics.Win.Appearance();
        this.numBox04 = new Ice.Lib.Framework.EpiNumericEditor();
        this.numBox03 = new Ice.Lib.Framework.EpiNumericEditor();
        this.numBox02 = new Ice.Lib.Framework.EpiNumericEditor();
        this.numBox01 = new Ice.Lib.Framework.EpiNumericEditor();
        this.lblTitle04 = new System.Windows.Forms.Label();
        this.lblTitle03 = new System.Windows.Forms.Label();
        this.lblTitle02 = new System.Windows.Forms.Label();
        this.lblTitle01 = new System.Windows.Forms.Label();
        this.btnBox01 = new AdeComboButton();
        this.btnBox02 = new AdeComboButton();
        this.btnBox03 = new AdeComboButton();
        this.btnBox04 = new AdeComboButton();
        ((System.ComponentModel.ISupportInitialize)(this.numBox04)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numBox03)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numBox02)).BeginInit();
        ((System.ComponentModel.ISupportInitialize)(this.numBox01)).BeginInit();
        this.SuspendLayout();
        // 
        // numBox04
        // 
        this.numBox04.AlwaysInEditMode = true;
        appearance1.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numBox04.Appearance = appearance1;
        this.numBox04.AutoSize = false;
        this.numBox04.DBColumn = null;
        this.numBox04.EpiGuid = "aa10d6fd-bdd2-4201-bf94-1fce1c4bd282";
        this.numBox04.Location = new System.Drawing.Point(161, 93);
        this.numBox04.MaskInput = "-nnnn";
        this.numBox04.Name = "numBox04";
        this.numBox04.Nullable = true;
        this.numBox04.PromptChar = ' ';
        this.numBox04.Size = new System.Drawing.Size(40, 24);
        this.numBox04.TabIndex = 11;
        // 
        // numBox03
        // 
        this.numBox03.AlwaysInEditMode = true;
        appearance2.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numBox03.Appearance = appearance2;
        this.numBox03.AutoSize = false;
        this.numBox03.DBColumn = null;
        this.numBox03.EpiGuid = "af425d4e-6ae2-44aa-93a2-7d48ccdd54c4";
        this.numBox03.Location = new System.Drawing.Point(161, 63);
        this.numBox03.MaskInput = "-nnnn";
        this.numBox03.Name = "numBox03";
        this.numBox03.Nullable = true;
        this.numBox03.PromptChar = ' ';
        this.numBox03.Size = new System.Drawing.Size(40, 24);
        this.numBox03.TabIndex = 12;
        // 
        // numBox02
        // 
        this.numBox02.AlwaysInEditMode = true;
        appearance3.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numBox02.Appearance = appearance3;
        this.numBox02.AutoSize = false;
        this.numBox02.DBColumn = null;
        this.numBox02.EpiGuid = "f72716e6-8a4a-4d12-8da2-8c835f6b9ff5";
        this.numBox02.Location = new System.Drawing.Point(161, 33);
        this.numBox02.MaskInput = "-nnnn";
        this.numBox02.Name = "numBox02";
        this.numBox02.Nullable = true;
        this.numBox02.PromptChar = ' ';
        this.numBox02.Size = new System.Drawing.Size(40, 24);
        this.numBox02.TabIndex = 13;
        // 
        // numBox01
        // 
        this.numBox01.AlwaysInEditMode = true;
        appearance4.ForeColorDisabled = System.Drawing.SystemColors.WindowText;
        this.numBox01.Appearance = appearance4;
        this.numBox01.AutoSize = false;
        this.numBox01.DBColumn = null;
        this.numBox01.EpiGuid = "e6d6aeb6-d0ff-48c2-9b47-b8852d02f904";
        this.numBox01.Location = new System.Drawing.Point(161, 3);
        this.numBox01.MaskInput = "-nnnn";
        this.numBox01.Name = "numBox01";
        this.numBox01.Nullable = true;
        this.numBox01.PromptChar = ' ';
        this.numBox01.Size = new System.Drawing.Size(40, 24);
        this.numBox01.TabIndex = 14;
        // 
        // lblTitle04
        // 
        this.lblTitle04.AutoSize = true;
        this.lblTitle04.Location = new System.Drawing.Point(124, 99);
        this.lblTitle04.Name = "lblTitle04";
        this.lblTitle04.Size = new System.Drawing.Size(32, 13);
        this.lblTitle04.TabIndex = 7;
        this.lblTitle04.Text = "Cant.";
        // 
        // lblTitle03
        // 
        this.lblTitle03.AutoSize = true;
        this.lblTitle03.Location = new System.Drawing.Point(124, 69);
        this.lblTitle03.Name = "lblTitle03";
        this.lblTitle03.Size = new System.Drawing.Size(32, 13);
        this.lblTitle03.TabIndex = 8;
        this.lblTitle03.Text = "Cant.";
        // 
        // lblTitle02
        // 
        this.lblTitle02.AutoSize = true;
        this.lblTitle02.Location = new System.Drawing.Point(124, 39);
        this.lblTitle02.Name = "lblTitle02";
        this.lblTitle02.Size = new System.Drawing.Size(32, 13);
        this.lblTitle02.TabIndex = 9;
        this.lblTitle02.Text = "Cant.";
        // 
        // lblTitle01
        // 
        this.lblTitle01.AutoSize = true;
        this.lblTitle01.Location = new System.Drawing.Point(124, 9);
        this.lblTitle01.Name = "lblTitle01";
        this.lblTitle01.Size = new System.Drawing.Size(32, 13);
        this.lblTitle01.TabIndex = 10;
        this.lblTitle01.Text = "Cant.";
        // 
        // btnBox01
        // 
        this.btnBox01.Location = new System.Drawing.Point(3, 3);
        this.btnBox01.Name = "btnBox01";
        this.btnBox01.Size = new System.Drawing.Size(115, 25);
        this.btnBox01.TabIndex = 15;
        // 
        // btnBox02
        // 
        this.btnBox02.Location = new System.Drawing.Point(3, 34);
        this.btnBox02.Name = "btnBox02";
        this.btnBox02.Size = new System.Drawing.Size(115, 25);
        this.btnBox02.TabIndex = 16;
        // 
        // btnBox03
        // 
        this.btnBox03.Location = new System.Drawing.Point(3, 63);
        this.btnBox03.Name = "btnBox03";
        this.btnBox03.Size = new System.Drawing.Size(115, 25);
        this.btnBox03.TabIndex = 17;
        // 
        // btnBox04
        // 
        this.btnBox04.Location = new System.Drawing.Point(3, 93);
        this.btnBox04.Name = "btnBox04";
        this.btnBox04.Size = new System.Drawing.Size(115, 25);
        this.btnBox04.TabIndex = 18;
        // 
        // PalletPanel
        // 
        this.Controls.Add(this.btnBox04);
        this.Controls.Add(this.btnBox03);
        this.Controls.Add(this.btnBox02);
        this.Controls.Add(this.btnBox01);
        this.Controls.Add(this.numBox04);
        this.Controls.Add(this.numBox03);
        this.Controls.Add(this.numBox02);
        this.Controls.Add(this.numBox01);
        this.Controls.Add(this.lblTitle04);
        this.Controls.Add(this.lblTitle03);
        this.Controls.Add(this.lblTitle02);
        this.Controls.Add(this.lblTitle01);
        this.Name = "PalletPanel";
        this.Size = new System.Drawing.Size(205, 120);
        ((System.ComponentModel.ISupportInitialize)(this.numBox04)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numBox03)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numBox02)).EndInit();
        ((System.ComponentModel.ISupportInitialize)(this.numBox01)).EndInit();
        this.ResumeLayout(false);
        this.PerformLayout();

    }

    #endregion

    public PalletPanel()
    {
        InitializeComponent();
    }
}

#endregion


