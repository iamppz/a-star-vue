<template>
    <div>
        <van-field></van-field>
        <van-popup v-model="showPop" :label="label" position="bottom" :overlay="true">
            <van-datetime-picker
                v-bind="$attrs"
                :value="currentDate"
                :type="type"
                title="请选择日期"
                @cancel="cancel"
                @confirm="confirm"
            ></van-datetime-picker>
        </van-popup>
    </div>
</template>
<script>
import { Field, Popup } from 'vant';

export default {
    name: 'VanFieldSelect',
    data() {
        return {};
    },
    components: {
        [Field.name]: Field,
        [Popup.name]: Popup
    }
};
</script>
