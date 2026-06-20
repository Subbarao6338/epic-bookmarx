import React, { useState } from 'react'
import { Button } from '@progress/kendo-react-buttons'
import { Label } from '@progress/kendo-react-labels'
import { save_metadata_url, tenant_id } from '../commonUtility/api_urls'
import { httppost, addnew_notifications } from '../commonUtility/common_http'
import { useHistory } from 'react-router-dom'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { loadMessages } from '@progress/kendo-react-intl'
import { Input } from '@progress/kendo-react-inputs'
import { enMessages } from './../messages/en-US'
import { name_title } from './../commonUtility/validation_regex'
import Swal from 'sweetalert2'
import { AccountInfoDetails } from '../authUtility/AccountInfo'
loadMessages(enMessages, 'en-US')

const navitems = [
  {
    id: 'home',
    route_url: '/services',
    text: 'Services',
    // iconClass: 'k-i-home',
  },
  {
    id: 'metadatasummary',
    route_url: '/metadata_summary',
    text: 'Metadata Summary',
  },
  {
    id: 'metadatacreate',
    route_url: '/metadata_create',
    text: 'Create Metadata',
  },
]

function Metadata() {
  const AccountInfo = AccountInfoDetails()

  const [err_msg, seterr_msg] = useState('')
  const page_name = enMessages['cdp_notifications']['page_metadata']

  let history = useHistory()
  const [navdata] = React.useState(navitems)
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    console.log(navdata[itemIndex]['route_url'])
    history.push(navdata[itemIndex]['route_url'])
  }

  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')

  const handleTitlechange = (e) => {
    const entered_title = e.target.value
    setTitle(entered_title)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    document.getElementById('back_button').style.visibility = 'hidden'
  }

  const handleFileUpload = () => {
    if (!new RegExp(name_title).test(title)) {
      seterr_msg(enMessages['cdp_validation_msg']['metadata_title'])
    } else {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', title)
      formData.append('file', selectedFile)
      formData.append('tenant_id', tenant_id)
      formData.append(
        'acc_details',
        AccountInfo['AccountName'],
      )

      httppost(save_metadata_url, formData)
        .then((res) => {
          if (res.data === 'Success') {
            const alert_type =
              enMessages['cdp_notifications']['alert_type_none']
            const alert_msg = '"' + title + '" Metadata Created Successfully.'
            addnew_notifications(
              AccountInfo['AccountName'],
              AccountInfo['AccountMail'],
              page_name,
              alert_type,
              alert_msg,
            )
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Metadata Created Successfully.',
              showConfirmButton: false,
              timer: 1500
            })
            history.push('/metadata_summary')
          } else {
            const alert_type =
              enMessages['cdp_notifications']['alert_type_error']
            const alert_msg = '"' + title + '" Metadata Creation Failed.'
            addnew_notifications(
              AccountInfo['AccountName'],
              AccountInfo['AccountMail'],
              page_name,
              alert_type,
              alert_msg,
            )
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Metadata Creation Failed.',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  const handlecancel = () => {
    history.push('/metadata_summary')
  }

  return (
    <div>
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />

      <div>
        <div>
          <div>
            <h3 align="left" id="heading">
              {enMessages.cdp_menus.metadatacreate}
            </h3>
          </div>
          <hr />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              flexWrap: 'nowrap',
              marginLeft: -40,
            }}
          >
            <div className="row mb-3">
              <div className="col-3" style={{ width: 200 }}>
                <Label className="required">Settings Title</Label>{' '}
              </div>
              <div className="col-4" style={{ width: 400 }}>
                <Input
                  className="borderall"
                  type="text"
                  required
                  value={title}
                  onChangeCapture={handleTitlechange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3" style={{ width: 200 }}>
                <Label className="required" style={{ marginLeft: -10 }}>
                  Upload File
                </Label>{' '}
              </div>
              <div className="col-4" style={{ width: 400 }}>
                <input
                  style={{ width: 375, borderRadius: 5 }}
                  className="borderall"
                  type="file"
                  accept=".csv, .json"
                  onChange={handleFileChange}
                />
                <br />
                <span className="note_class">Note: Upload only CSV/JSON.</span>
              </div>
            </div>
            {selectedFile ? <div></div> : 
            <div className="text-left" style={{ marginLeft: 50 }}>
              <Button
                id="btn"
                className="k-button k-primary"
                icon="close-outline"
                onClick={handlecancel}
              ></Button>
            </div> }

            {err_msg !== '' ? (
              <div>
                <span className="k-icon k-i-warning validationimage"> </span>{' '}
                &nbsp;
                <Label className="validationmsg">{err_msg}</Label>
              </div>
            ) : (
              <div></div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'left',
                marginLeft: 45,
                marginTop: 10,
              }}
            >
              {selectedFile && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    flexWrap: 'nowrap',
                  }}
                >
                  <span>
                    <b>Uploaded File details:-</b>
                  </span>
                  <div>
                    <b>File Name:</b> {selectedFile.name}
                  </div>
                  <div>
                    <b>File Type:</b> {selectedFile.type}
                  </div>
                  <div>
                    <b>Last Modified:</b>{' '}
                    {selectedFile.lastModifiedDate.toDateString()}
                  </div>
                  <br></br>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'left',
                      height: 'auto',
                      width: 'auto',
                    }}
                  >
                    <div className="row">
                      <div className="col-1">
                        <Button
                          id="btn"
                          icon={loading ? 'loading' : 'save'}
                          primary={true}
                          onClick={handleFileUpload}
                        ></Button>
                      </div>
                      <div className="col-1 ms-4">
                        <Button
                          id="btn"
                          onClick={handlecancel}
                          icon="close-outline"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Metadata
