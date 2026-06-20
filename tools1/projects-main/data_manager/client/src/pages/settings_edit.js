import * as React from 'react'
import { Dialog } from '@progress/kendo-react-dialogs'
import { Form, Field, FormElement } from '@progress/kendo-react-form'
import { Input } from '@progress/kendo-react-inputs'
import { Button } from '@progress/kendo-react-buttons'

const EditTab = (props) => {
  return (
    <Dialog
      title={`Edit ${props.item.title}`}
      onClose={props.cancelEdit}
      width={450}
      height={530}
    >
      <Form
        onSubmit={props.onSubmit}
        initialValues={props.item}
        render={(formRenderProps) => (
          <FormElement
            style={{
              maxWidth: 900,
            }}
          >
            <fieldset className={'k-form-fieldset'}>
              <div className="parent">
                <div className="left">
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'storage_account'}
                      component={Input}
                      label={'Storage Account'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'azure_sql_instance'}
                      component={Input}
                      label={'Azure SQL Instance'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'service_principal'}
                      component={Input}
                      label={'Service Proncipal'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'powerbi'}
                      component={Input}
                      label={'PowerBI URL'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'druid'}
                      component={Input}
                      label={'Druid URL'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'kibana'}
                      component={Input}
                      label={'Kibana URL'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              <div className="parent">
                <div className="left">
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'airflow_url'}
                      component={Input}
                      label={'Airflow URL'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'prefect_url'}
                      component={Input}
                      label={'Prefect URL'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'aion_url'}
                      component={Input}
                      label={'AION URL'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'databricks'}
                      component={Input}
                      label={'Databricks'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              <div className="parent">
                <div className="left">
                  <div className="mb-3 me-3 filed_size">
                    <Field
                      className="borderall"
                      name={'notebook'}
                      component={Input}
                      label={'Notebook URL'}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="right"></div>
              </div>
            </fieldset>
            <div className="k-form-buttons">
              <Button
                type={'submit'}
                className="k-button k-primary"
                icon="save"
                id="btn"
                disabled={!formRenderProps.allowSubmit}
              ></Button>
              <Button
                type={'submit'}
                className="k-button"
                icon="close-outline"
                id="btn"
                onClick={props.cancelEdit}
              ></Button>
            </div>
          </FormElement>
        )}
      />
    </Dialog>
  )
}

export default EditTab
