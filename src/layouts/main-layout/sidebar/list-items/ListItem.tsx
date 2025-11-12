import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconifyIcon from 'components/base/IconifyIcon';
import { useActiveRoute } from 'hooks/useActiveRoute';

const ListItem = ({ subheader, icon, path, ...item }: MenuItem) => {
  const { isMenuItemActive } = useActiveRoute();
  const active = isMenuItemActive(item as MenuItem);

  return (
    <ListItemButton
      component={Link}
      href={path}
      sx={{
        mb: 2.5,
        bgcolor: active ? 'primary.main' : null,
        borderRadius: 2,
        '&:hover': {
          bgcolor: active ? 'primary.main' : 'rgba(67, 24, 255, 0.08)',
        },
      }}
    >
      <ListItemIcon>
        {icon && (
          <IconifyIcon
            icon={icon}
            fontSize="h4.fontSize"
            sx={{
              color: active ? 'white' : 'text.secondary',
            }}
          />
        )}
      </ListItemIcon>
      <ListItemText
        primary={subheader}
        sx={{
          '& .MuiListItemText-primary': {
            color: active ? 'white' : 'text.primary',
            fontWeight: active ? 600 : 500,
          },
        }}
      />
    </ListItemButton>
  );
};

export default ListItem;
