<template>
    <div class="flow-design">
        <div class="zoom">
            <div class="zoom-out"></div>
            <span>100%</span>
            <div class="zoom-in"></div>
        </div>
        <div class="box-scale" id="box-scale" style="transform: scale(1); transform-origin: 50% 0px 0px;">
            <div class="node-wrap">
                <div class="node-wrap-box node_sid-startevent start-node">
                    <div>
                        <div class="title" style="background: rgb(87, 106, 149);"><span class="">发起人</span></div>
                        <div class="content">
                            <div class="text">所有人</div>
                            <i class="anticon anticon-right arrow"></i></div>
                    </div>
                </div>
                <div class="add-node-btn-box">
                    <div class="add-node-btn">
                        <button class="btn" type="button"><span class="iconfont"
                                                                data-spm-anchor-id="0.0.0.i0.62684490cKWa6g"></span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="branch-wrap">
                <div class="branch-box-wrap">
                    <div class="branch-box" data-spm-anchor-id="0.0.0.i11.62684490cKWa6g">
                        <div class="col-box">
                            <div class="top-left-cover-line"></div>
                            <div class="bottom-left-cover-line"></div>
                            <div class="node-wrap">
                                <div class="node-wrap-box node_7aae_48a0">
                                    <div>
                                        <div class="title" style="background: rgb(50, 150, 250);"><span
                                                class="iconfont"></span><span class="editable-title">抄送人</span><i
                                                class="anticon anticon-close close"></i></div>
                                        <div class="content">
                                            <div class="text">发起人自选</div>
                                            <i class="anticon anticon-right arrow"></i></div>
                                    </div>
                                </div>
                                <div class="add-node-btn-box">
                                    <div class="add-node-btn">
                                        <button class="btn" type="button"><span class="iconfont"></span></button>
                                    </div>
                                </div>
                            </div>
                            <div class="node-wrap">
                                <div class="node-wrap-box node_sid-1234_5678">
                                    <div>
                                        <div class="title" style="background: rgb(255, 148, 62);"><span
                                                class="iconfont"></span><span class="editable-title">审批人</span><i
                                                class="anticon anticon-close close"></i></div>
                                        <div class="content">
                                            <div class="text">发起人自选</div>
                                            <i class="anticon anticon-right arrow"></i></div>
                                    </div>
                                </div>
                                <div class="add-node-btn-box">
                                    <div class="add-node-btn">
                                        <button class="btn" type="button"><span class="iconfont"></span></button>
                                    </div>
                                </div>
                            </div>
                            <div class="node-wrap">
                                <div class="node-wrap-box node_9955_7e43">
                                    <div>
                                        <div class="title" style="background: rgb(50, 150, 250);"><span
                                                class="iconfont"></span><span class="editable-title">抄送人</span><i
                                                class="anticon anticon-close close"></i></div>
                                        <div class="content">
                                            <div class="text">发起人自选</div>
                                            <i class="anticon anticon-right arrow"></i></div>
                                    </div>
                                </div>
                                <div class="add-node-btn-box">
                                    <div class="add-node-btn">
                                        <button class="btn" type="button"><span class="iconfont"></span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-box" data-spm-anchor-id="0.0.0.i10.62684490cKWa6g">
                            <div class="node-wrap">
                                <div class="node-wrap-box node_6c1e_2c57">
                                    <div>
                                        <div class="title" style="background: rgb(255, 148, 62);"><span
                                                class="iconfont"></span><span class="editable-title">审批人</span><i
                                                class="anticon anticon-close close"></i></div>
                                        <div class="content">
                                            <div class="text"><span class="placeholder">请选择审批人</span></div>
                                            <i class="anticon anticon-right arrow"></i></div>
                                    </div>
                                </div>
                                <div class="add-node-btn-box">
                                    <div class="add-node-btn" data-spm-anchor-id="0.0.0.i15.62684490cKWa6g">
                                        <button class="btn" type="button"><span class="iconfont"></span></button>
                                    </div>
                                </div>
                            </div>
                            <div class="top-right-cover-line"></div>
                            <div class="bottom-right-cover-line"></div>
                        </div>
                    </div>
                    <div class="add-node-btn-box">
                        <div class="add-node-btn">
                            <button class="btn" type="button"><span class="iconfont"></span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="end-node">
                <div class="end-node-circle"></div>
                <div class="end-node-text">流程结束</div>
            </div>
        </div>
    </div>
</template>
<script>
    import '../../assets/flow-design.css';

    export default {
        mounted() {
        }
    }
</script>
<style scoped>
</style>