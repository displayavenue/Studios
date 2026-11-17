{{-- Shared image crop / zoom / rotate modal with live frontend preview --}}
<div class="hp-imgadj" id="hp-imgadj" hidden data-hp-imgadj>
    <div class="hp-imgadj__backdrop" data-hp-imgadj-close></div>
    <div class="hp-imgadj__dialog" role="dialog" aria-modal="true" aria-labelledby="hp-imgadj-title">
        <header class="hp-imgadj__header">
            <div>
                <h3 id="hp-imgadj-title">Adjust image</h3>
                <p class="admin-muted" style="margin:0.2rem 0 0;">Zoom and drag the image inside the website box. The right panel shows how it will look after you save.</p>
                <p class="admin-muted" style="margin:0.35rem 0 0;" data-hp-imgadj-mode-hint>Website box size is fixed. Drag the image to reposition, use Zoom to scale — sides will not shrink together.</p>
            </div>
            <button type="button" class="btn btn-secondary" data-hp-imgadj-close>Close</button>
        </header>

        <div class="hp-imgadj__workspace">
            <div class="hp-imgadj__stage">
                <img data-hp-imgadj-image alt="Image being adjusted">
            </div>

            <aside class="hp-imgadj__frontend" aria-label="Frontend preview">
                <div class="hp-imgadj__frontend-head">
                    <strong>Frontend preview</strong>
                    <select data-hp-imgadj-preview-type title="Preview as">
                        <option value="disease">A–Z disease card</option>
                        <option value="disease-detail">Disease detail</option>
                        <option value="doctor">Doctor / team photo</option>
                        <option value="product">Product card</option>
                        <option value="hero">Homepage hero</option>
                        <option value="gallery">Gallery / landscape</option>
                    </select>
                </div>
                <div class="hp-imgadj__frontend-frame" data-hp-imgadj-preview-frame data-preview="disease">
                    {{-- Exact A–Z disease website card (same structure/look as storefront) --}}
                    <a class="hp-disease-card hp-disease-card--preview" data-preview-panel="disease" href="#" tabindex="-1" onclick="return false;">
                        <span class="hp-disease-card__media" data-hp-imgadj-preview-media></span>
                        <span class="hp-disease-card__body">
                            <strong data-hp-imgadj-preview-title>Disease title</strong>
                            <small data-hp-imgadj-preview-subtitle>Category</small>
                        </span>
                    </a>
                    <div class="hp-prev hp-prev--disease-detail" data-preview-panel="disease-detail" hidden>
                        <div class="hp-prev__media hp-prev__media--wide" data-hp-imgadj-preview-media></div>
                        <p class="hp-prev__caption">Condition page image</p>
                    </div>
                    <div class="hp-prev hp-prev--doctor" data-preview-panel="doctor" hidden>
                        <div class="hp-prev__media hp-prev__media--square" data-hp-imgadj-preview-media></div>
                        <div class="hp-prev__body">
                            <strong>Doctor name</strong>
                            <small>Consulting physician</small>
                        </div>
                    </div>
                    <div class="hp-prev hp-prev--product" data-preview-panel="product" hidden>
                        <div class="hp-prev__media hp-prev__media--square" data-hp-imgadj-preview-media></div>
                        <div class="hp-prev__body">
                            <strong>Product name</strong>
                            <small>Brand</small>
                        </div>
                    </div>
                    <div class="hp-prev hp-prev--hero" data-preview-panel="hero" hidden>
                        <div class="hp-prev__media hp-prev__media--hero" data-hp-imgadj-preview-media></div>
                        <p class="hp-prev__caption">Homepage hero strip</p>
                    </div>
                    <div class="hp-prev hp-prev--gallery" data-preview-panel="gallery" hidden>
                        <div class="hp-prev__media hp-prev__media--gallery" data-hp-imgadj-preview-media></div>
                        <p class="hp-prev__caption">Gallery / blog cover</p>
                    </div>
                </div>
                <p class="admin-muted hp-imgadj__frontend-note">Live preview updates as you crop. Saving replaces the file used on the public site.</p>
            </aside>
        </div>

        <div class="hp-imgadj__controls">
            <label class="hp-imgadj__control">
                <span>Aspect</span>
                <select data-hp-imgadj-aspect>
                    <option value="NaN">Free</option>
                    <option value="1">Square 1∶1</option>
                    <option value="{{ 1376/1146 }}">Disease 1376∶1146</option>
                    <option value="0.8">Portrait 4∶5</option>
                    <option value="{{ 16/9 }}">Landscape 16∶9</option>
                    <option value="{{ 21/9 }}">Wide 21∶9</option>
                    <option value="{{ 2000/751 }}">Hero ~2000∶751</option>
                </select>
            </label>
            <label class="hp-imgadj__control">
                <span>Zoom</span>
                <input type="range" data-hp-imgadj-zoom min="0.2" max="3" step="0.01" value="1">
            </label>
            <div class="hp-imgadj__actions">
                <button type="button" class="btn btn-secondary" data-hp-imgadj-rotate="-90">Rotate left</button>
                <button type="button" class="btn btn-secondary" data-hp-imgadj-rotate="90">Rotate right</button>
                <button type="button" class="btn btn-secondary" data-hp-imgadj-reset>Reset</button>
            </div>
        </div>

        <footer class="hp-imgadj__footer">
            <button type="button" class="btn btn-secondary" data-hp-imgadj-close>Cancel</button>
            <button type="button" class="btn btn-primary" data-hp-imgadj-apply>Apply &amp; save to website</button>
        </footer>
    </div>
</div>
