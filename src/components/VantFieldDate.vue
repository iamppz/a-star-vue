<template>
    <div class="vant-field-date">
        <van-field
            :label="label"
            :value="value"
            :placeholder="placeholder"
            @click="showPop = true"
        ></van-field>
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
import { Field, Popup, DatetimePicker } from 'vant';

export default {
    name: 'VanFieldDate',
    components: {
        [Field.name]: Field,
        [Popup.name]: Popup,
        [DatetimePicker.name]: DatetimePicker
    },
    props: {
        value: {
            type: [String],
            default: undefined
        },
        label: {
            type: String,
            default: null
        },
        required: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        format: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: 'datetime'
        }
    },
    data() {
        return {
            showPop: false
        };
    },
    methods: {
        confirm(value) {
            this.$emit('input', this.dateFormat(value, this.formatFormula));
            this.$emit('change', this.dateFormat(value, this.formatFormula));
            this.showPop = false;
        },
        cancel() {
            this.showPop = false;
        },
        dateFormat: (value, format) => {
            if (!value) return '';
            if (!(value instanceof Date)) {
                value = new Date(value);
            }
            let o = {
                'M+': value.getMonth() + 1, // month
                'd+': value.getDate(), // day
                'h+': value.getHours(), // hour
                'm+': value.getMinutes(), // minute
                's+': value.getSeconds(), // second
                'q+': Math.floor((value.getMonth() + 3) / 3), // quarter
                S: value.getMilliseconds() // millisecond
            };

            if (!format || format === '') {
                format = 'yyyy-MM-dd hh:mm:ss';
            }

            if (/(y+)/.test(format)) {
                format = format.replace(
                    RegExp.$1,
                    (value.getFullYear() + '').substr(4 - RegExp.$1.length)
                );
            }

            for (let k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(
                        RegExp.$1,
                        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                    );
                }
            }
            return format;
        }
    },
    computed: {
        formatFormula() {
            if (this.format) {
                return this.format;
            } else if (this.type === 'date') {
                return 'yyyy-MM-dd';
            } else if (this.type === 'datetime') {
                return 'yyyy-MM-dd hh:mm';
            } else if (this.type === 'time') {
                return 'hh:mm';
            } else if (this.type === 'year-month') {
                return 'yyyy-MM';
            } else {
                return 'yyyy-MM-dd hh:mm';
            }
        },
        text() {
            return this.value ? this.dateFormat(this.value, this.formatFormula) : '';
        },
        currentDate() {
            return new Date(this.value);
        }
    }
};
</script>
