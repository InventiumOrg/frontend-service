import Grid from '@mui/material/Grid';
import CreditBalance from 'components/sections/dashboard/credit-balance';
import CreateCatelogueForm from 'components/sections/form/catelogue';

const Catelogue = () => {
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={6}>
        <CreateCatelogueForm />
      </Grid>
      <Grid item xs={12} md={6}>
        <CreditBalance />
      </Grid>
    </Grid>
  );
};

export default Catelogue;
