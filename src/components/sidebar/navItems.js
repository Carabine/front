import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ChatIcon from '@material-ui/icons/ChatOutlined';
import CodeIcon from '@material-ui/icons/Code';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import FolderIcon from '@material-ui/icons/FolderOutlined';
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone';
import GradeTwoTone from '@material-ui/icons/GradeTwoTone';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import MailIcon from '@material-ui/icons/MailOutlined';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import VideoLibraryOutlinedIcon from '@material-ui/icons/VideoLibraryOutlined';

var iconsMap = {
  BarChartIcon: BarChartIcon,
  CalendarTodayIcon: CalendarTodayIcon,
  ChatIcon: ChatIcon,
  CodeIcon: CodeIcon,
  DashboardIcon: DashboardIcon,
  ErrorIcon: ErrorIcon,
  FolderIcon: FolderIcon,
  DashboardTwoToneIcon: DashboardTwoToneIcon,
  GradeTwoTone: GradeTwoTone,
  ListAltIcon: ListAltIcon,
  LockOpenIcon: LockOpenIcon,
  MailIcon: MailIcon,
  PresentToAllIcon: PresentToAllIcon,
  PeopleIcon: PeopleIcon,
  PersonIcon: PersonIcon,
  ReceiptIcon: ReceiptIcon,
  SettingsIcon: SettingsIcon,
  ViewModuleIcon: ViewModuleIcon,
  VideoLibraryOutlinedIcon
};

export default [
  {
    label: '',
    content: JSON.parse(
     `[
        {
          "label": "main",
          "icon": "DashboardTwoToneIcon",
          "to": "/main"
        },    
        {
          "label": "myProjects",
          "icon": "FolderIcon",
          "to": "/projects"
        }, 
        {
          "label": "myMediafiles",
          "icon": "VideoLibraryOutlinedIcon",
          "to": "/mediafiles"
        },
        {
          "label": "categories",
          "icon": "DashboardTwoToneIcon",
          "content": [
            {
              "label": "transport",
              "description": "????????????????.",
              "to": "/main/transport"
            },
            {
              "label": "music",
              "description": "????????????????",
              "to": "/main/music"
            },
            {
              "label": "animals",
              "description": "????????????????.",
              "to": "/main/animals"
            },
            {
              "label": "sport",
              "description": "????????????????.",
              "to": "/main/sport"
            },
            {
              "label": "travels",
              "description": "????????????????.",
              "to": "/main/travels"
            },
            {
              "label": "games",
              "description": "????????????????.",
              "to": "/main/games"
            },
            {
              "label": "peopleAndBlogs",
              "description": "????????????????.",
              "to": "/main/peopleAndBlogs"
            },
            {
              "label": "humor",
              "description": "????????????????.",
              "to": "/main/humor"
            },
            {
              "label": "entertainment",
              "description": "????????????????.",
              "to": "/main/entertainment"
            },
            {
              "label": "newsAndPolitics",
              "description": "????????????????.",
              "to": "/main/newsAndPolitics"
            },
            {
              "label": "hobbyAndStyle",
              "description": "????????????????.",
              "to": "/main/hobbyAndStyle"
            },
            {
              "label": "education",
              "description": "????????????????.",
              "to": "/main/education"
            },
            {
              "label": "scienceAndTechnology",
              "description": "????????????????.",
              "to": "/main/scienceAndTechnology"
            },
            {
              "label": "businessAndFinances",
              "description": "????????????????.",
              "to": "/main/businessAndFinances"
            }
          ]
        }
      ]`,
      (key, value) => {
        if (key === 'icon') {
          return iconsMap[value];
        } else {
          return value;
        }
      }
    )
  }
];
