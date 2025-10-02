import { useState, useEffect } from 'react';
import { MenuItem } from 'routes/sitemap';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import IconifyIcon from 'components/base/IconifyIcon';
import { useActiveRoute } from 'hooks/useActiveRoute';

const CollapseListItem = ({ subheader, items, icon, ...item }: MenuItem) => {
  const { isMenuItemActive, isSubMenuItemActive } = useActiveRoute();
  const active = isMenuItemActive(item as MenuItem);
  const [open, setOpen] = useState(active);

  // Auto-expand if any sub-item is active
  useEffect(() => {
    if (active) {
      setOpen(true);
    }
  }, [active]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ pb: 1.5 }}>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          {icon && (
            <IconifyIcon
              icon={icon}
              sx={{
                color: active ? 'primary.main' : 'text.secondary',
              }}
            />
          )}
        </ListItemIcon>
        <ListItemText
          primary={subheader}
          sx={{
            '& .MuiListItemText-primary': {
              color: active ? 'primary.main' : 'text.primary',
              fontWeight: active ? 600 : 500,
            },
          }}
        />
        <IconifyIcon
          icon="iconamoon:arrow-down-2-duotone"
          sx={{
            color: active ? 'primary.main' : 'text.disabled',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items?.map((route) => {
            const isSubActive = isSubMenuItemActive(route);
            return (
              <ListItemButton
                key={route.pathName}
                component={Link}
                href={route.path}
                sx={{
                  ml: 2.25,
                  bgcolor: isSubActive ? 'primary.main' : null,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: isSubActive ? 'primary.main' : 'rgba(67, 24, 255, 0.08)',
                  },
                }}
              >
                <ListItemText
                  primary={route.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isSubActive ? 'white' : 'text.primary',
                      fontWeight: isSubActive ? 600 : 500,
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
};

export default CollapseListItem;
