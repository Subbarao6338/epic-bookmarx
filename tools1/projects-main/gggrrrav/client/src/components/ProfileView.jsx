import * as React from 'react'
import { AccountInfoDetails } from '../authUtility/AccountInfo'
// import { useMsal } from '@azure/msal-react'
import { useHistory } from 'react-router'
import { Avatar } from '@progress/kendo-react-layout'
import { Label } from '@progress/kendo-react-labels'
import { Link } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { Loader } from '@progress/kendo-react-indicators'
import { httpget_notification } from '../commonUtility/common_http'
import {
  projects_nameslist,
  update_projects_config,
} from '../commonUtility/api_urls'
import Popup from 'reactjs-popup'
import Password from './changepassword'

export const ProfileView = (props) => {
  const AccountInfo = AccountInfoDetails()
  // const { instance } = useMsal()
  const history = useHistory()

  const logout = () => {
    if (history.length > 2) {
      history.push('/')
      localStorage.setItem('isUserAuthorized', false)
    }
  }

  // const handleLogout = () => {
  //   instance
  //     .logoutPopup()
  //     .then(() => {
  //       //on logout -> go to '/'
  //       history.push('/')
  //     })
  //     .catch((err) => console.error(err))
  // }

  const ProjectsName = localStorage.getItem('ProjectName')

  const [selproject, setSelproject] = React.useState(ProjectsName)
  //const [selectedProjects, setselectedProjects] = React.useState(ProjectsName);

  const [projectlist, setProjectslist] = React.useState([])
  const [editshow, setEditShow] = React.useState(false)
  const project_edit = () => {
    setEditShow(true)
    const req_value = {
      params: { AccountMail: AccountInfo['AccountMail'] },
    }

    httpget_notification(projects_nameslist, req_value).then((result) => {
      setProjectslist(result)
    })
  }
  const project_update = () => {
    const req_value = {
      params: {
        AccountMail: AccountInfo['AccountMail'],
        ProjectName: selproject,
      },
    }

    httpget_notification(update_projects_config, req_value).then((result) => {
      setProjectslist(result)
    })

    localStorage.setItem('ProjectName', selproject)
    setEditShow(false)
  }
  return (
    <div>
      <div style={{ width: 250, marginLeft: 10 }}>
        <br />
        <div style={{ width: 70, float: 'left' }}>
          <Avatar type="text" size="large">
            <span style={{ fontWeight: 'Bold', fontSize: 'x-large' }}>
              {AccountInfo['Account_ShortName']}
            </span>
          </Avatar>
        </div>
        <div
          style={{
            width: 180,
            float: 'left',
          }}
        >
          <Label
            className="header_profile_name"
            style={{ paddingTop: '10px', fontWeight: 'bold' }}
          >
            {AccountInfo['AccountName']}
          </Label>
          <br />
          {/* <span style={{ fontStyle: "italic" }}> */}
          <span>{AccountInfo['AccountRole']}</span>
        </div>
      </div>
      <br /> <br /> <br />
      <div style={{ height: 20 }}></div>
      <div>
        {editshow ? (
          <div
            style={{
              paddingTop: '10px',
              paddingLeft: '10px',
              paddingRight: '5px',
            }}
          >
            <DropDownList
              style={{
                width: '80%',
                fontSize: 16,
                paddingLeft: '10px',
                paddingRight: '5px',
              }}
              data={projectlist}
              value={selproject}
              onChange={(event) => {
                setSelproject(event.target.value)
              }}
            />
            &nbsp; &nbsp; &nbsp;
            <Button
              className="savebutton"
              icon="save"
              onClick={project_update}
            ></Button>
          </div>
        ) : (
          <div>
            {ProjectsName !== '' ? (
              <div
                style={{
                  paddingLeft: '10px',
                  paddingRight: '5px',
                }}
              >
                <Label
                  style={{
                    width: '80%',
                    fontSize: 16,
                    paddingLeft: '10px',
                    paddingRight: '5px',
                  }}
                >
                  {ProjectsName}
                </Label>
                &nbsp; &nbsp; &nbsp;
                <Button
                  className="updatebutton"
                  icon="edit"
                  onClick={project_edit}
                ></Button>
              </div>
            ) : (
              <div
                style={{
                  paddingLeft: '10px',
                  paddingRight: '5px',
                }}
              >
                <Label style={{ alignContent: 'center' }}>
                  Project Loading <Loader themeColor="info" type="pulsing" />
                </Label>
              </div>
            )}
          </div>
        )}
      </div>
      <br />
      <div
        className="row p-2 border-bottom border-top align-middle align-center"
        style={{
          margin: 0,
        }}
      >
        <Link
          style={{ marginLeft: 5 }}
          to="/projects_summary"
          onClick={props.popupClose}
        >
          Projects
        </Link>
      </div>
      <div
        className="row p-2 border-bottom align-middle"
        style={{
          margin: 0,
        }}
      >
        <Link
          onClick={props.popupClose}
          style={{ marginLeft: 5 }}
          to="/organization_summary"
        >
          Organization
        </Link>
      </div>
      <Popup
        trigger={
          <div
            style={{
              textAlign: 'end',
              margin: 8,
            }}
          >
            <Link style={{ fontSize: 'small' }}>Change Password</Link>
          </div>
        }
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <Button className="close" onClick={close}>
              &times;
            </Button>
            <div className="head">Change Password</div>
            <div className="cont">
              <Password />
            </div>
          </div>
        )}
      </Popup>
      <div
        className="row p-2 mb-3"
        style={{
          margin: 0,
          alignSelf: 'center',
          float: 'right',
          width: 100,
        }}
      >
        {/* <Button className="cancelbutton" icon="logout" onClick={handleLogout}>
          Logout
        </Button> */}
        <Button className="cancelbutton" icon="logout" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  )
}
