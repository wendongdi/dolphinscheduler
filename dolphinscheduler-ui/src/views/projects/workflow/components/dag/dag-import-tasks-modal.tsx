/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {defineComponent, getCurrentInstance, PropType, ref} from 'vue'
import Modal from '@/components/modal'
import {useI18n} from 'vue-i18n'
import {
  NForm,
  NFormItem,
  NInput
} from 'naive-ui'
import './x6-style.scss'
import {useImportTasksModel} from './dag-hooks'
import isJson from "@/utils/json";
import {genTaskCodeList} from "@/service/modules/task-definition";
import {uuid} from "@/common/common";
import {useRoute} from "vue-router";

export default defineComponent({
    name: 'dag-import-tasks-modal',
    props: {
      visible: {
        type: Boolean as PropType<boolean>,
        default: false
      },
      left: {
        type: Number as PropType<number>,
        default: 0
      },
      top: {
        type: Number as PropType<number>,
        default: 0
      }
    },
    emits: ['toggle', 'copyTask'],
    setup(props, ctx) {
      let cpVersion = 'v0.1'
      const trim = getCurrentInstance()?.appContext.config.globalProperties.trim
      const magicCode = ref<string>('')
      const route = useRoute()
      const projectCode = Number(route.params.projectCode)

      function submit() {
        try {
          const body = JSON.parse(magicCode.value)
          const tasks = body.tasks
          for (let j = 0; j < tasks.length; j++) {
            const task = tasks[j]
            const genNums = 1
            const type = task.data.taskType
            const taskName = uuid(task.data.taskName + '_')
            const targetCode = Number(task.id)
            const flag = task.data.flag

            genTaskCodeList(genNums, projectCode).then((res) => {
              const [code] = res
              ctx.emit('copyTask', taskName, code, targetCode, type, flag, {
                x: props.left + 100 * (j + 1),
                y: props.top + 100 * (j + 1)
              })
            })
          }
        } finally {
          ctx.emit('toggle', false)
        }
      }

      function cancel() {
        ctx.emit('toggle', false)
      }

      function canConfirm() {
        return magicCode.value
          && isJson(magicCode.value)
          && JSON.parse(magicCode.value)?.tasks
      }

      function matchVersion() {
        return magicCode.value
          && isJson(magicCode.value)
          && JSON.parse(magicCode.value)?.version == cpVersion
      }

      return {
        trim,
        magicCode,
        submit,
        cancel,
        canConfirm
      }
    },
    render() {
      const {t} = useI18n()
      return (
        <Modal
          title={t('project.dag.import_task')}
          show={this.$props.visible}
          onConfirm={this.submit}
          onCancel={this.cancel}
          confirmDisabled={!this.canConfirm()}
        >
          <NForm ref='dagImportTasks'>
            <NFormItem label={t('project.dag.import_task_code')} path='code'>
              <NInput
                allowInput={this.trim}
                type='textarea'
                v-model={[this.magicCode, 'value']}
                placeholder={t('resource.udf.enter_description_tips')}
                class='input-description'
              />
            </NFormItem>
          </NForm>
        </Modal>
      )
    }
  }
)
