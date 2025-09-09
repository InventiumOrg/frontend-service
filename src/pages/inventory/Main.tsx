import Grid from "@mui/material/Grid";
import Transactions from "components/sections/dashboard/transactions";
import CreditBalance from "components/sections/dashboard/credit-balance";
import TransactionHistory from "components/sections/inventory-explore/inventory-history";
import CreateInventoryForm from "components/sections/form/inventory";

const Inventory = () => {
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={12}>
        <CreateInventoryForm />
      </Grid>
      <Grid item xs={12} md={6}>
        <Transactions />
      </Grid>
      <Grid item xs={12} md={6}>
        <CreditBalance />
      </Grid>
      <Grid item xs={12} md={12}>
        <TransactionHistory />
      </Grid>
    </Grid>
  );
};

export default Inventory;
