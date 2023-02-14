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

import {ref} from 'vue'
import utils from "@/utils";
import type {Graph, Cell} from '@antv/x6'
import {useI18n} from "vue-i18n";
import {useMessage} from "naive-ui";

export function useImportTasksModel() {
  let cpVersion = 'v0.1'
  const {t} = useI18n()
  const message = useMessage()

  const visible = ref<boolean>(false)
  const toggle = (bool?: boolean) => {
    if (typeof bool === 'boolean') {
      visible.value = bool
    } else {
      visible.value = !visible.value
      debugger;
    }
  }

  function openImportWindow() {
    toggle(true)
  }

  function handleCopyToClipboard(graph: Graph) {
    let tasks = Array();
    graph?.getSelectedCells().forEach((x: Cell) => {
      if (x.data?.taskType) {
        tasks.push({
          'data': x.data,
          'id': x.id
        })
      }
    })
    if (tasks.length <= 0) {
      message.warning(t("project.node.copy_to_clipboard_warning"))
    } else {
      if (utils.copy(JSON.stringify({
        "version": cpVersion,
        "tasks": tasks
      }))) {
        message.success(tasks.length + t("project.node.copy_to_clipboard_success"))
      } else {
        message.error(t("project.node.copy_failed"))
      }
    }
  }

  return {
    toggle,
    visible,
    openImportWindow,
    handleCopyToClipboard
  }
}


