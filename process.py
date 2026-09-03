import os
from PIL import Image, ImageDraw, ImageFilter

def process_dishes():
    src_path = r"C:\Users\ARYA K A\.gemini\antigravity\scratch\ponjikkara-sadhya\assets\sadhya_real.jpg"
    out_dir = r"C:\Users\ARYA K A\.gemini\antigravity\scratch\ponjikkara-sadhya\assets\dishes"
    os.makedirs(out_dir, exist_ok=True)

    img = Image.open(src_path).convert("RGBA")
    w_total, h_total = img.size

    def crop_with_feather(name, box, feather_radius=6, make_oval=True):
        x1, y1, x2, y2 = box
        cropped = img.crop((x1, y1, x2, y2))
        cw, ch = cropped.size

        # Create mask
        mask = Image.new("L", (cw, ch), 0)
        draw = ImageDraw.Draw(mask)
        margin = max(4, feather_radius)
        if make_oval:
            draw.ellipse((margin, margin, cw - margin, ch - margin), fill=255)
        else:
            draw.rounded_rectangle((margin, margin, cw - margin, ch - margin), radius=12, fill=255)

        # Feather the mask edges
        mask = mask.filter(ImageFilter.GaussianBlur(feather_radius))
        
        # Apply mask to alpha channel
        cropped.putalpha(mask)
        
        out_path = os.path.join(out_dir, f"{name}.png")
        cropped.save(out_path, "PNG")
        print(f"Saved {name}.png ({cw}x{ch})")

    # 1. Real Matta Rice
    crop_with_feather("real_rice", (370, 260, 750, 520), feather_radius=8, make_oval=True)

    # 2. Pappadam (Puffed round papad)
    crop_with_feather("real_pappadam", (240, 190, 435, 365), feather_radius=4, make_oval=True)

    # 3. Banana (Pazham)
    crop_with_feather("real_banana", (180, 260, 335, 450), feather_radius=5, make_oval=False)

    # 4. Upperi (Banana chips)
    crop_with_feather("real_upperi", (105, 275, 205, 385), feather_radius=5, make_oval=True)

    # 5. Sharkara Varatti (Jaggery coated plantain chunks)
    crop_with_feather("real_sharkara", (155, 355, 240, 440), feather_radius=4, make_oval=True)

    # 6. Inji Puli (Dark ginger-tamarind concentrate)
    crop_with_feather("real_injipuli", (230, 135, 315, 210), feather_radius=4, make_oval=True)

    # 7. Mango Pickle (Spicy red cut mango)
    crop_with_feather("real_mangopickle", (155, 175, 260, 265), feather_radius=4, make_oval=True)

    # 8. Naranga Pickle (Wild lemon pickle, cropped with spicy tinge)
    crop_with_feather("real_narangapickle", (160, 180, 255, 260), feather_radius=4, make_oval=True)

    # 9. Thoran (Cabbage/beans coconut stir-fry)
    crop_with_feather("real_thoran", (320, 120, 475, 235), feather_radius=6, make_oval=True)

    # 10. Olan (Ash gourd in white coconut milk)
    crop_with_feather("real_olan", (480, 130, 610, 235), feather_radius=6, make_oval=True)

    # 11. Avial (Mixed veg in thick curd-coconut sauce)
    crop_with_feather("real_avial", (595, 95, 740, 250), feather_radius=6, make_oval=True)

    # 12. Erissery / Theeyal (Roasted coconut pumpkin curry)
    crop_with_feather("real_erissery", (725, 105, 830, 225), feather_radius=5, make_oval=True)

    # 13. Kalan (Yam in tart turmeric yogurt)
    crop_with_feather("real_kalan", (815, 70, 930, 170), feather_radius=5, make_oval=True)

    # 14. Khichadi (Tempered cucumber curd curry)
    crop_with_feather("real_khichadi", (790, 185, 935, 335), feather_radius=6, make_oval=True)

    # 15. Pachadi (Sweet pineapple pachadi / curd relish)
    crop_with_feather("real_pachadi", (795, 190, 925, 330), feather_radius=6, make_oval=True)

    # 16. Parippu & Ghee (Golden mashed dal mound)
    crop_with_feather("real_parippu", (750, 365, 850, 465), feather_radius=5, make_oval=True)

    # 17. Sambar (Drumstick and vegetable tamarind stew)
    crop_with_feather("real_sambar", (610, 285, 760, 450), feather_radius=6, make_oval=True)

    # 18. Payasam Uruli (Traditional brass uruli with rich pinkish Palada Payasam)
    crop_with_feather("real_payasam", (0, 430, 245, 565), feather_radius=4, make_oval=False)

    # 19. Clean Leaf Texture snippet
    leaf_clean = img.crop((850, 350, 1010, 550)).convert("RGB")
    leaf_clean.save(os.path.join(out_dir, "clean_leaf_texture.jpg"), "JPEG", quality=95)
    print("Saved clean_leaf_texture.jpg")

if __name__ == "__main__":
    process_dishes()
