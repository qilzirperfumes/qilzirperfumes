from PIL import Image

def process_logo():
    img = Image.open('d:/qilzirperfumes/public/logo_full.png').convert("RGBA")
    grayscale = img.convert("L")
    gray_data = grayscale.getdata()
    
    # We sample the corner to confidently get the background gray level
    width, height = img.size
    bg_level = max(gray_data[0], gray_data[width-1], gray_data[(height-1)*width]) 
    # Just in case, let's take a value near max to ensure clean cutoff
    
    new_data = []
    for val in gray_data:
        # Protect against division by zero
        if bg_level == 0: bg_level = 1 
        
        # We want anything >= bg_level to be fully transparent (0 alpha)
        # Anything dark (0) to be fully opaque (255 alpha)
        # We might want to tighten the curve so light greys also become transparent
        # and dark greys become quickly opaque
        
        alpha = int(255 * (bg_level - val) / bg_level)
        alpha = max(0, min(255, alpha))
        
        # Boost alpha slightly to keep edges crisp
        alpha = int(min(255, alpha * 1.5))
        
        new_data.append((26, 26, 26, alpha)) # #1A1A1A extremely dark grey black
        
    img.putdata(new_data)
    img.save('d:/qilzirperfumes/public/logo_transparent.png', 'PNG')

if __name__ == '__main__':
    process_logo()
